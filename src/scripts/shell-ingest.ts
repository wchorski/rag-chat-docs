import { ingestMarkdownDocs } from "../utils/db-ingest.js"
import config from "../config.json" with { type: 'json' };

async function shellIngest() {
  // command line arg override
	const col_name = process.argv
		.find((arg) => arg.startsWith("--collection="))
		?.split("=")[1]
	if (!col_name) throw new Error("col_name not set")

	const cfg = config.collections[col_name as keyof typeof config.collections]
	// const collectionConfig = config.collections.find(col => col.name === collection_name)

	const argDirPath = process.argv
		.find((arg) => arg.startsWith("--dir_path="))
		?.split("=")[1]
	const dir_path = argDirPath || cfg?.document_directory
	if (!dir_path) throw new Error("dir_path not set")

  await ingestMarkdownDocs(col_name, dir_path, cfg.uri_base).catch(console.error)
}

shellIngest()