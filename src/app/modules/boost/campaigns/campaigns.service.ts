import { Injectable } from '@angular/core';
import { Campaign } from './campaigns.type';
import { Client } from '../../../services/api/client';

export type CampaignsServiceListOptions = {
  limit?: number;
  offset?: string;
}

@Injectable()
export class CampaignsService {

  constructor(
    protected client: Client,
  ) {
  }

  async list(opts: CampaignsServiceListOptions = {}): Promise<{ campaigns: Array<Campaign>, 'load-next'?: string }> {
    const queryString = {
      limit: opts.limit || 12,
      offset: opts.offset || '',
    };

    return await this.client.get(`api/v2/boost/campaigns`, queryString) as any;
  }

  async get(urn: string): Promise<Campaign> {
    return (await this.client.get(`api/v2/boost/campaigns/${urn}`) as any).campaign;
  }

  async create(campaign: Campaign): Promise<Campaign> {
    return await this.client.post(`api/v2/boost/campaigns`, campaign) as Campaign;
  }

  async update(campaign: Campaign): Promise<Campaign> {
    if (!campaign.urn) {
      throw new Error('Missing campaign URN');
    }

    return await this.client.post(`api/v2/boost/campaigns/${campaign.urn}`, campaign) as Campaign;
  }
}
