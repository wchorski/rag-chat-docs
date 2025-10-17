// print process.argv
// console.log("--- process.argv ---");
// console.log(process.argv);


async function testArgs(
  directory_path: string,
  collection_name: string
) {
  // command line arg override
  const argDirPath = process.argv
    .find((arg) => arg.startsWith("--dir_path="))
    ?.split("=")[1]
  const dir_path = argDirPath || directory_path

  const argCollectionName = process.argv
    .find((arg) => arg.startsWith("--collection="))
    ?.split("=")[1]
  const col_name = argCollectionName || collection_name

  console.log({
    col_name, dir_path
  });
}

testArgs("./docs", "dogs").catch(console.error)
