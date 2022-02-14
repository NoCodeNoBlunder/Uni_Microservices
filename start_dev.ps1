$curDir = Get-Location
Start-Job -WorkingDirectory $curDir//MicroShop//micro-shop-frontend {npm run start:dev}
Start-Job -WorkingDirectory $curDir//MicroShop//micro-shop-backend {npm run start:dev}
Start-Job -WorkingDirectory $curDir//MicroWarehouse//micro-warehouse-frontend {npm run start:dev}
Start-Job -WorkingDirectory $curDir//MicroWarehouse//micro-warehouse-backend {npm run start:dev}

