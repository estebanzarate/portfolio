import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

const { stdout, stderr } = await exec("curl", [
  "--compressed",
  "https://tryhackme.com/api/v2/rooms/my-rooms?page=1&limit=200",
  "-H", `Cookie: ${process.env.THM_COOKIES}`,
  "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:152.0) Gecko/20100101 Firefox/152.0",
  "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "-H", "Accept-Language: en-US",
  "-H", "Accept-Encoding: gzip, deflate, br, zstd",
  "-H", "Upgrade-Insecure-Requests: 1",
  "-H", "Sec-Fetch-Dest: document",
  "-H", "Sec-Fetch-Mode: navigate",
  "-H", "Sec-Fetch-Site: none",
  "-H", "Sec-Fetch-User: ?1",
  "-H", "Priority: u=0, i",
  "-H", "TE: trailers",
]);

console.log(stdout);