const OFFLINE = true;
const urlMap = {
  recommend: 'https://static001.geekbang.org/univer/classes/js_dev/data/getRecommendationPageData'
}
const staticData = {
  recommend: {
    "focusData": [
      {
        "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/banner1.jpg",
        "url": "https://time.geekbang.org/column/intro/100023201"
      },
      {
        "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/banner2.jpg",
        "url": "https://time.geekbang.org/column/intro/100023201"
      },
      {
        "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/banner3.jpg",
        "url": "https://time.geekbang.org/column/intro/100023201"
      }
    ],
    "mostFavourateShops": [
      {
        "name": "极客时间旗舰店",
        "promotion": "科技风 行业优质",
        "fans": "20241111",
        "icon": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/shop_logo1.jpg",
        "level": "5",
        "url": "https://time.geekbang.org/column/intro/100023201",
        "items": [
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/1.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          },
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/2.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          }
        ]
      },
      {
        "name": "乔丹旗舰店",
        "promotion": "科技风 行业优质",
        "fans": "20241111",
        "icon": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/shop_logo2.jpg",
        "level": "5",
        "url": "https://time.geekbang.org/column/intro/100023201",
        "items": [
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/3.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          },
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/4.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          }
        ]
      }
    ],
    "recommendedShops": [
      {
        "name": "极客时间旗舰店",
        "promotion": "科技风 行业优质",
        "fans": "20241111",
        "icon": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/shop_logo3.jpg",
        "level": "5",
        "url": "https://time.geekbang.org/column/intro/100023201",
        "items": [
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/big1.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          },
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/5.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          },
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/6.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          }
        ]
      },
      {
        "name": "极客大学旗舰店",
        "promotion": "科技风 行业优质",
        "fans": "20241111",
        "icon": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/shop_logo4.jpg",
        "level": "5",
        "url": "https://time.geekbang.org/column/intro/100023201",
        "items": [
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/big2.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          },
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/7.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          },
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/8.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          }
        ]
      },
      {
        "name": "infoQ官方旗舰店",
        "promotion": "科技风 行业优质",
        "fans": "20241111",
        "icon": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/shop_logo5.jpg",
        "level": "5",
        "url": "https://time.geekbang.org/column/intro/100023201",
        "items": [
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/big3.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          },
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/9.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          },
          {
            "image": "https://static001.geekbang.org/univer/classes/js_dev/static/recommendation/10.jpg",
            "url": "https://time.geekbang.org/column/intro/100023201"
          }
        ]
      }
    ]
  }
};

// https://static001.geekbang.org/univer/classes/js_dev/data/getInterestingPageDataTypeAll
// https://static001.geekbang.org/univer/classes/js_dev/data/getInterestingPageDataTypeSuprise
// https://static001.geekbang.org/univer/classes/js_dev/data/getInterestingPageDataTypeUnexpect
// https://static001.geekbang.org/univer/classes/js_dev/data/getNewPageData
export function getData(key) {
  const url = urlMap[key];
  if (!url) {
    throw new Error('unknow data key');
  }

  if (OFFLINE) {
    return offlineFetch(staticData[key]);
  }
  return fetch(url);
}
function offlineFetch(data) {
  return new Promise(resolve => {
    setTimeout(() => resolve(new WrapJson(data)));
  })
}
class WrapJson {
  constructor(data) {
    this.data = data;
  }
  json() {
    return Promise.resolve(this.data);
  }
}