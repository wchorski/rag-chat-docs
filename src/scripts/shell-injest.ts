import { ingestMarkdownDocs } from "../utils/db-injest.js"
import config from "../config.json" with { type: 'json' };

async function shellInjest() {
  // command line arg override
	const col_name = process.argv
		.find((arg) => arg.startsWith("--collection="))
		?.split("=")[1]
	if (!col_name) throw new Error("col_name not set")

	const cf = config.collections[col_name as keyof typeof config.collections]
	// const collectionConfig = config.collections.find(col => col.name === collection_name)

	const argDirPath = process.argv
		.find((arg) => arg.startsWith("--dir_path="))
		?.split("=")[1]
	const dir_path = argDirPath || cf?.document_directory
	if (!dir_path) throw new Error("dir_path not set")

  await ingestMarkdownDocs(col_name, dir_path, cf.uri_base).catch(console.error)
}

shellInjest()
