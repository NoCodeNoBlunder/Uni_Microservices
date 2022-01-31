import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PickTask {
  // TODO what is a prop
  @Prop({ required: true })
  code: string; // This is the order id.

  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  address: string; // We combined customer name and address into a single field.

  @Prop({ required: true })
  palette: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  locations: string[];
}
export const PickTaskSchema = SchemaFactory.createForClass(PickTask);
