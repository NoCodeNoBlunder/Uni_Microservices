$curDir = Get-Location
Start-Job -Name "shopFrontend"  -WorkingDirectory $curDir//MicroShop//micro-shop-frontend {npm run start:dev}
Start-Job -Name "shopBackend" -WorkingDirectory $curDir//MicroShop//micro-shop-backend {npm run start:dev}
Start-Job -Name "wareFrontend" -WorkingDirectory $curDir//MicroWarehouse//micro-warehouse-frontend {npm run start:dev}
Start-Job -Name "WareBackend" -WorkingDirectory $curDir//MicroWarehouse//micro-warehouse-backend {npm run start:dev}
