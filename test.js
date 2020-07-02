const lineItems = [{ id: 123 }, { id: 456 }, { id: 789 }];
const dbItems = [{ id: 123 }, { id: 456 }, { id: 789 }];

const validLineItems = [];

const serverItems = lineItems.forEach((item, index) => {
  item.id === dbItems[index].id ? validLineItems.push(item) : 'error';
});

console.log(validLineItems);
