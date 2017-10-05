import { EventEmitter } from "events";
import * as iconv from "iconv-lite";
import * as rp from "request-promise";
import * as cheerio from 'cheerio';


const options = {
    method: 'GET',
    uri: 'https://www.apple.com/shop/browse/home/specialdeals/mac/macbook_pro/13',
    encoding: null
}

let laptops: Array<Model> = [];
let prev: Array<Model> = laptops.concat();
let next: Array<Model> = [];

rp(options)
    .then(data => {
        // console.log(data);
        // let decoded = iconv.decode(data, "win1251");
        let $ = cheerio.load(data);
        let a = $('.product').each((index, productData) => {
            let specs = $(productData).find(".specs");
            let purchaseInfo = $(productData).find(".purchase-info");
            
            let title = specs.find("a").text().trim()
            let body = specs.html().split("<p></p>").pop();
            let params = body.trim().split("<br>").map(line => line.replace(/[\n]/g, ""));
            let is2015 = params.length > 0 ? params[0].indexOf("2015") != -1 : false;
            let is13 = title.indexOf("13.3") != -1;

            if (is2015 && is13) {
                let item = new Model(title, params, specs, purchaseInfo);

                let index = prev.findIndex(el => el.equals(specs));
                if (index != -1) {
                    prev.splice(index, 1);
                }
                else {
                    next.push(item);
                    console.log("+++ " + item.getShortDescription());
                }
            }
        });
    })
    .catch(err => console.log(err));

if (prev.length > 0) {
    prev.forEach(el => "--- " + el.getShortDescription());
}

laptops = next;

class Model {
    constructor(
        public title: string,
        public specs: string[],
        private rawSpecs: Cheerio,
        private rawPurchase: Cheerio
    ) { }

    equals(other: Cheerio): boolean {
        return this.rawSpecs.html() == other.html();
    }

    toString(): string {
        return `{
title: ${this.title},
specs: ${JSON.stringify(this.specs)}
}`
    }

    // ${this.title.match(/(\d{2}\.\d+)(?=-inch)/i).shift()} ${this.raw.text().match(/(\d\.\d)GHz/g).shift()}
    getShortDescription(): string {
        let res = "";
        this.rawSpecs.text().match(/(\d+?)(GB|TB)/g).forEach(match => res += (res.length > 0 ? " " : "") + match)
        let price = this.rawPurchase.find(".price").text().trim();
        let savings = this.rawPurchase.find(".savings").text().trim();
        res += (res.length > 0 ? " " : "") + price;
        res += savings.length > 0 ? " (" + savings + ")" : ""
        return res;
    }
}





