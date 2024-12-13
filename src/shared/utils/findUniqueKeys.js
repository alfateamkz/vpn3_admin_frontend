
const findUniqueKeys = (oldData, newData) => {

    const changedValues = {};
    console.log(oldData, newData)
    for (const key in oldData) {
        if (typeof oldData[key] === 'object') {

           const repeatObj = findUniqueKeys(oldData[key], newData[key])

            if (Object.keys(repeatObj).length === 0) {
                
            } else {
                changedValues[key] = repeatObj
            }

        } else {
            if (
                oldData.hasOwnProperty(key) &&
                newData.hasOwnProperty(key) &&
                oldData[key] !== newData[key]
            ) {
                changedValues[key] = newData[key];
            }
        }

    }

    return changedValues;
}

export default findUniqueKeys