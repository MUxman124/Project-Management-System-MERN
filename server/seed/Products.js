import Product from "../models/productModel.js";
const products = [{
    "_id": {
      "$oid": "675ad8c2f721f29cc51fc51f"
    },
    "name": "sd",
    "description": "sdf",
    "price": 11.99,
    "imageUrl": "https://tailwindui.com/plus/img/ecommerce-images/home-page-02-product-02.jpg",
    "category": "sdf",
    "stock": 21,
    "createdAt": {
      "$date": "2024-12-12T12:36:18.034Z"
    },
    "__v": 0
  },
  {
    "_id": {
      "$oid": "676173365942d311e69df0aa"
    },
    "name": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    "price": 109.55,
    "imageUrl": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "category": "men's clothing",
    "stock": 100,
    "createdAt": {
      "$date": "2024-12-17T12:48:54.346Z"
    },
    "__v": 5,
    "reviews": [
      {
        "$oid": "676a68ac35b09a9d85743db4"
      },
      {
        "$oid": "676a6f671f6cdb938793015d"
      },
      {
        "$oid": "676aa4ba0320f1c5c06b942d"
      },
      {
        "$oid": "676aa8cf0320f1c5c06b947c"
      },
      {
        "$oid": "676e4abea9a137fed899bbf1"
      }
    ]
  },
  {
    "_id": {
      "$oid": "676173ac5942d311e69df0ae"
    },
    "name": "Mens Casual Premium Slim Fit T-Shirts",
    "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.\",\n    \"category\": \"men's clothing",
    "price": 22.32,
    "imageUrl": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    "category": "men's clothing",
    "stock": 20,
    "createdAt": {
      "$date": "2024-12-17T12:50:52.130Z"
    },
    "__v": 1,
    "reviews": [
      {
        "$oid": "676aaa480320f1c5c06b9493"
      }
    ]
  },
  {
    "_id": {
      "$oid": "676173e85942d311e69df0b2"
    },
    "name": "Mens Cotton Jacket",
    "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day",
    "price": 55.55,
    "imageUrl": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    "category": "Mens Cotton Jacket",
    "stock": 12,
    "createdAt": {
      "$date": "2024-12-17T12:51:52.771Z"
    },
    "__v": 0
  },
  {
    "_id": {
      "$oid": "676174f55942d311e69df0b6"
    },
    "name": "Mens Casual Slim Fit",
    "description": "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
    "price": 67.98,
    "imageUrl": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    "category": "men's clothing",
    "stock": 23,
    "createdAt": {
      "$date": "2024-12-17T12:56:21.552Z"
    },
    "__v": 0
  },
  {
    "_id": {
      "$oid": "6762b3f75942d311e69df417"
    },
    "name": "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED",
    "description": "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag",
    "price": 999.99,
    "imageUrl": "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
    "category": "electronics",
    "stock": 10,
    "createdAt": {
      "$date": "2024-12-18T11:37:27.389Z"
    },
    "__v": 1,
    "reviews": [
      {
        "$oid": "6762edf8b7580e0760ec3d2f"
      }
    ]
  },
  {
    "_id": {
      "$oid": "6762b42c5942d311e69df41b"
    },
    "name": "DANVOUY Womens T Shirt Casual Cotton Short",
    "description": "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
    "price": 23.45,
    "imageUrl": "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
    "category": "women's clothing",
    "stock": 12,
    "createdAt": {
      "$date": "2024-12-18T11:38:20.680Z"
    },
    "__v": 0
  },
  {
    "_id": {
      "$oid": "6762b4a15942d311e69df41f"
    },
    "name": "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
    "description": "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz",
    "price": 1200,
    "imageUrl": "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    "category": "electronics",
    "stock": 12,
    "createdAt": {
      "$date": "2024-12-18T11:40:17.080Z"
    },
    "__v": 0
  }]

  const insertProducts = async () => {
    try {
      const result = await Product.insertMany(products);
      console.log(`Data inserted successfully. ${result.insertedCount} documents inserted.`);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  export { insertProducts };