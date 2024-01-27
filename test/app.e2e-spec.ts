import * as request from 'supertest';


describe('AppController (e2e)', () => {

  jest.setTimeout(180000);

  it('/ (GET)', async () => {

    request(global.app.getHttpServer())
      .get('/orders/health')
      .expect(200)
      .expect('{"message":"ok"}');

    const payload = {
      "orderId": "1236",
      "description": "desc 1",
      "customerId": "1234",
      "orderlines": [
        {
          "orderlineId": "12",
          "skuId": "234234"

        }
      ],
      "deliveryAddress": {
        "addressId": "223",
        "addressLine1": "address line 1"

      }
    }

    const response = await request(global.app.getHttpServer())
      .post('/orders')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(201);

      //const location = response.headers().

      // .then((response)=>{
      //   return request(global.app.getHttpServer()).get('/orders/' + payload.orderId)
      //   .expect(200)
      //   .expect('{"orderId":"1236","description":"desc 1","orderlines":[{"orderlineId":"12"}],"deliveryAddress":{"addressId":"223","addressLine1":"address line 1"}}')
      // })

  });


});
