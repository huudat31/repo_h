import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private esClient: Client | null = null;
  private isAvailable = false;
  private readonly INDEX_NAME = 'ecommerce_products';

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const node = this.configService.get<string>('ELASTICSEARCH_NODE', 'http://localhost:9200');

    try {
      this.esClient = new Client({ node });
      const ping = await this.esClient.ping();
      if (ping) {
        this.isAvailable = true;
        this.logger.log(`🔎 Connected to Elasticsearch at ${node}`);
        await this.createIndexIfNotExists();
      }
    } catch (err: any) {
      this.logger.warn(`Elasticsearch not reachable: ${err.message}. Search will fallback to SQL/Prisma.`);
    }
  }

  private async createIndexIfNotExists() {
    if (!this.esClient || !this.isAvailable) return;
    try {
      const exists = await this.esClient.indices.exists({ index: this.INDEX_NAME });
      if (!exists) {
        await this.esClient.indices.create({
          index: this.INDEX_NAME,
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                name: { type: 'text', analyzer: 'standard' },
                slug: { type: 'keyword' },
                categoryName: { type: 'keyword' },
                price: { type: 'double' },
                description: { type: 'text' },
                specs: { type: 'object', dynamic: true },
              },
            },
          },
        });
        this.logger.log(`Created index ${this.INDEX_NAME}`);
      }
    } catch (err: any) {
      this.logger.error(`Error creating ES index: ${err.message}`);
    }
  }

  async indexProduct(product: any) {
    if (!this.esClient || !this.isAvailable) return;
    try {
      await this.esClient.index({
        index: this.INDEX_NAME,
        id: product.id,
        document: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          categoryName: product.category?.name || '',
          price: product.price,
          description: product.description,
          specs: product.specs || {},
        },
      });
    } catch (err: any) {
      this.logger.error(`Failed to index product ${product.id}: ${err.message}`);
    }
  }

  async removeProduct(productId: string) {
    if (!this.esClient || !this.isAvailable) return;
    try {
      await this.esClient.delete({
        index: this.INDEX_NAME,
        id: productId,
      });
    } catch (err: any) {
      this.logger.error(`Failed to delete product ${productId} from ES: ${err.message}`);
    }
  }

  async search(query: string, minPrice?: number, maxPrice?: number): Promise<string[] | null> {
    if (!this.esClient || !this.isAvailable) return null;

    try {
      const must: any[] = [];

      if (query) {
        must.push({
          multi_match: {
            query,
            fields: ['name^3', 'description', 'categoryName^2'],
            fuzziness: 'AUTO',
          },
        });
      }

      const filter: any[] = [];
      if (minPrice !== undefined || maxPrice !== undefined) {
        const range: any = {};
        if (minPrice !== undefined) range.gte = minPrice;
        if (maxPrice !== undefined) range.lte = maxPrice;
        filter.push({ range: { price: range } });
      }

      const response = await this.esClient.search({
        index: this.INDEX_NAME,
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter,
          },
        },
      });

      return response.hits.hits.map((hit: any) => hit._source.id);
    } catch (err: any) {
      this.logger.warn(`Elasticsearch query error: ${err.message}`);
      return null;
    }
  }
}
