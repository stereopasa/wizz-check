async function testAsync() {
    await promise()
        .then(num => {
            console.log(num)
        })
}

function promise() {
    console.log("start promise function")
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("timeout end");
            resolve(123)
        }, 1000);
    })
}

async function test() {
    return await Promise.resolve(true);
}

testAsync();

test().then(res => console.log("res " + res));