const containsAll = (arr1, arr2) => arr2.every((arr2Item) => arr1.includes(arr2Item));
const sameMembers = (arr1, arr2) => containsAll(arr1, arr2) && containsAll(arr2, arr1);

module.exports = { sameMembers };
