const myArray = [1, 2, 3];

const start = async () => {
  await asyncForEach(myArray, async (num) => {
    await waitFor(1000);
    console.log(num);
  });

  console.log('done');
};

start();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function waitFor(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
