import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

// Data Transfer Object
export class SetPriceDto {
  @IsNotEmpty()
  @IsString()
  product: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}
