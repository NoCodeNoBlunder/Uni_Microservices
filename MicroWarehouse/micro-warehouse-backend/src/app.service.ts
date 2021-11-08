/** Defines the Operations that are used by app.controller.ts */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Course!';
  }

  /**
   * Creates the answer with dummy data for now as a list of JSON objects.
   * @param key is an alias for the last part of the URL.
   */
  getQuery(key: string): any {
    const answer = {
      key: key,
      result: [
        {
          blockId: 'pal001', // Identifier of building block
          time: '12:00:00', // Each event has a time.
          evenType: 'PaletteStored', // Tells us what kind of building block we are dealing with. Builder pattern used.
          tags: ['palettes', 'red shoes'], // keywords that are attached to the event which will allow to ask for a subset of events.

          // contains the actual data above is meta information.
          payload: {
            barcode: 'pal001',
            product: 'red shoes',
            amount: 10,
            location: 'shelf 42',
          },
        },
        {
          blockId: 'pal002',
          time: '12:01:00',
          evenType: 'PaletteStored',
          tags: ['palettes', 'red shoes'],
          payload: {
            barcode: 'pal002',
            product: 'red shoes',
            amount: 10,
            location: 'shelf 23',
          },
        },
      ],
    };

    // return `${key}`;
    return answer;
  }
}
