import { getPropertyById } from "./services/propertyService";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
    const id = "2d91d12e-4dee-48ae-a27d-d1b504659bbc";
    console.log(`Fetching property ${id}...`);
    const property = await getPropertyById(id);

    if (property) {
        console.log("✅ Property found:");
        console.log("Owner:", JSON.stringify(property.owner, null, 2));
        console.log("Agent:", JSON.stringify(property.agent, null, 2));
    } else {
        console.log("❌ Property not found");
    }
}

main();
