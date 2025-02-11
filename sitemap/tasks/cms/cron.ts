import { defineTask, runCronTasks } from "nitropack/runtime";
export default defineTask({
  meta: {
    name: "cms:cron",
    description: "Run database migrations",
  },
  run() {
    console.log("Running DB migration task...");
    return { result: "Success" };
  },
});
