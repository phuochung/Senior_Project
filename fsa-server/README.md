# **BUILD GUIDE** #

### 1. Initialize provider: ###

*Insert data from sp_data_backup.txt into 'provider' collection (password: admin)

### 2. Run app ###
### 3. Feedback roulette ###
Notes: This link is for testing only. Must disabled on production.
(1) GET: http://localhost:3000/provider/code?username=admin&billNo=123&billValue=123456
(2) GET: http://localhost:3000/?fbId={fbId}&refStr={refStr(1)}

### 4. Food roulette ###
Notes: This link is for testing only. Must disabled on production.
(1) GET: http://localhost:3000/provider/code?username=admin&billNo=123&billValue=123456
(2) GET: http://localhost:3000/food?fbId={fbId}&refStr={refStr(1)}

### 5. Gift page ###
(1) GET: http://localhost:3000/auth/token/{fbId}
(2) GET: http://localhost:3000/gift?token={token}

### 6. Promotion view/ Menu view ###
GET: http://localhost:3000/view/promotion-detail?id={promotionId}&providerId={providerId}&token={optionalTokenShipApi}
GET: http://localhost:3000/view/menu-detail?id={menuId}&providerId={providerId}&token={optionalTokenShipApi}

### 6. NOTE ###
- If something goes wrong with above links, go debug.
