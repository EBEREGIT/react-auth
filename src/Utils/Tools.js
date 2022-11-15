export let DateExtract = (value) =>{
    let day = value.$D;
    let month = value.$M + 1;
    let year = value.$y;
    return [day, month, year]
}