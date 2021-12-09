import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Defines what data a Product event contains.
 */
@Schema()
export class MSProduct {
  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  amount: number = 0;

  @Prop({ required: true })
  amountTime: string;

  // This is optional therfore no requiered: True.
  @Prop()
  price: string;
}

export const ProductSchema = SchemaFactory.createForClass(MSProduct);
