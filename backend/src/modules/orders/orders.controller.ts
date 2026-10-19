import { Controller, Post, Get, Param, Body, Patch, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query('status') status?: OrderStatus, @Query('search') search?: string) {
    return this.ordersService.findAllOrders(status, search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-orders')
  async findMyOrders(@Request() req: any) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get(':code')
  async findByCode(@Param('code') code: string) {
    return this.ordersService.findByCode(code);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId')
  async findByUser(@Request() req: any, @Param('userId') userId: string) {
    if (req.user.role !== Role.ADMIN && req.user.id !== userId) {
      return this.ordersService.findByUser(req.user.id);
    }
    return this.ordersService.findByUser(userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/assign-staff')
  async assignStaff(@Param('id') id: string, @Body('staff') staff: string) {
    return this.ordersService.assignStaff(id, staff);
  }
}
