import * as rp from "request-promise";

const getPromise = (count) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(".");
      resolve(++count);
    }, 3000);
  });
};

// Promise.all([getPromise(), getPromise(), getPromise()]);

console.log("before")
Promise.resolve(0)
  .then((count) => getPromise(count))
  .then((count) => getPromise(count))
  .then((count) => getPromise(count))
  .then((count) => console.log("res: " + count))

console.log("after")
