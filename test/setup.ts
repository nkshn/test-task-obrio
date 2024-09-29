import { execSync } from "child_process"

import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({ path: path.resolve(__dirname, "../.env.test") })

// Extract the DB name from the DATABASE_URL
const dbName = process.env.DATABASE_URL?.split("/").pop()?.split("?")[0]

module.exports = async () => {
	if (!dbName) {
		throw new Error("DATABASE_URL is not defined or incorrect")
	}

	// Create the database if it doesn't exist
	try {
		execSync(`psql -U test_user -c "CREATE DATABASE ${dbName};"`, {
			stdio: "inherit"
		})
	} catch (error) {
		console.log("Database already exists, skipping creation.")
	}

	// Run migrations and reset the test database
	execSync("npx prisma migrate reset --force", { stdio: "inherit" })
}
