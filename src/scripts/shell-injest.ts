import { ingestMarkdownDocs } from "../utils/db-injest.js";

ingestMarkdownDocs(undefined, undefined).catch(console.error)