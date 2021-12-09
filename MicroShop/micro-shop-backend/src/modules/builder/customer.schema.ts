import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Customer {
  @Prop({ require: true })
  name: string;

  @Prop({ required: true })
  lastAddress: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
