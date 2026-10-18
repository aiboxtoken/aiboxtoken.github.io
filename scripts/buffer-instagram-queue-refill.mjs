import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const apiKey = process.env.BUFFER_API_KEY;
if (!apiKey) {
  console.log("Skipped: BUFFER_API_KEY is not configured. No Buffer API request was made.");
  process.exit(0);
}

const endpoint = "https://api.buffer.com";
const targetChannelId = "6ad4be74778b240e2f484d29";
const targetHandle = "aiboxtoken";
const queueTarget = 10;
const bangkokUtcHour = 1; // 08:00 Asia/Bangkok
const anchorDate = "2026-10-19";
const repo = "aiboxtoken/aiboxtoken.github.io";
const imageDirectory = "assets/buffer-instagram";

const content = [
  { text: "Bring cloud storage, software and support together in a workflow your team can actually use. Explore AiBox Solution and AIBOXS: https://aibox.myqnapcloud.com #AiBoxSolution #AIBOXS", headline: "A better connected workday", topic: "integration", alt: "A central digital hub connects cloud storage, business software and team workflows." },
  { text: "Keep important files close across your digital life. AiBox Cloud helps connect storage with the devices and services your team already uses. Learn more: https://aibox.myqnapcloud.com #AiBoxCloud #AIBOXS", headline: "Your files, within reach", topic: "cloud", alt: "A cloud hub connects files across a laptop, tablet and mobile device." },
  { text: "Turn repetitive handoffs into clearer steps. AiBox helps connect business tools into workflows shaped around everyday operations. Discover AIBOXS: https://aibox.myqnapcloud.com #Automation #AIBOXS", headline: "Less manual work", topic: "workflow", alt: "Connected business app cards form a streamlined automated workflow." },
  { text: "Make Odoo fit your business process. AiBox supports practical customization and integrations that help teams manage repeatable work. Explore: https://aibox.myqnapcloud.com #Odoo #AiBoxSolution", headline: "Odoo, shaped for your team", topic: "odoo", alt: "A business process flows through connected Odoo-style software panels." },
  { text: "Useful AI starts with a real need. AiBox explores practical ways to support knowledge, service and daily business operations. Meet AIBOXS: https://aibox.myqnapcloud.com #AI #AIBOXS", headline: "AI for real workflows", topic: "ai", alt: "An AI network connects business knowledge, customer support and operations." },
  { text: "From cloud services to business integrations, AiBox brings technology pieces into a more practical digital foundation. Discover the AIBOXS ecosystem: https://aibox.myqnapcloud.com #DigitalServices #AIBOXS", headline: "Build on a stronger base", topic: "cloud", alt: "Cloud, software and automation modules join into one digital foundation." },
  { text: "Connect QNAP storage with the services around it. AiBox Cloud helps make files and everyday business workflows work together. Start here: https://aibox.myqnapcloud.com #QNAP #AiBoxCloud", headline: "Storage that fits your setup", topic: "storage", alt: "A NAS storage system links a cloud with connected business devices." },
  { text: "When email, messaging, payments and data connect, teams can spend less time copying information between apps. Explore AiBox integrations: https://aibox.myqnapcloud.com #Integration #AIBOXS", headline: "Connect the tools you use", topic: "integration", alt: "Email, messaging, payment and data services connect through a business hub." },
  { text: "AiBox Solution helps teams plan cloud, software and automation together, with integrations designed around their operations. Learn about AIBOXS: https://aibox.myqnapcloud.com #AiBoxSolution #AIBOXS", headline: "One practical digital plan", topic: "workflow", alt: "A roadmap links cloud services, software and automation into a practical plan." },
  { text: "Explore AiBox Wallet and the broader AIBOXS ecosystem on Solana. See how AiBox services connect cloud, software and Web3: https://aibox.myqnapcloud.com #AIBOXS #Solana", headline: "Explore the AIBOXS ecosystem", topic: "wallet", alt: "A digital wallet concept sits within a connected Web3 service network." },
  { text: "Give your business tools a clearer path to work together. AiBox supports integrations across software, storage, communication and payments. Explore: https://aibox.myqnapcloud.com #BusinessTools #AIBOXS", headline: "Make your stack work together", topic: "integration", alt: "Business applications connect through a clean central integration layer." },
  { text: "Cloud services work best when they fit the way people already work. AiBox connects storage and digital workflows across devices. Discover AiBox: https://aibox.myqnapcloud.com #Cloud #AiBoxSolution", headline: "Cloud built around work", topic: "cloud", alt: "Files move securely between connected work devices and a cloud workspace." },
  { text: "Bring sales, inventory and operations into a smoother flow with connected business systems. AiBox helps teams reduce repetitive steps. Learn more: https://aibox.myqnapcloud.com #Automation #AIBOXS", headline: "Move work forward", topic: "workflow", alt: "Sales, inventory and operations move through a connected workflow." },
  { text: "A thoughtful Odoo setup can support the way your team actually operates. AiBox helps tailor workflows and connect related services. Explore: https://aibox.myqnapcloud.com #Odoo #AiBoxSolution", headline: "Software that fits the process", topic: "odoo", alt: "A configurable business software workspace connects process steps and services." },
  { text: "Use AI where it can make a useful difference: finding knowledge, supporting service and simplifying everyday operations. Explore AiBox: https://aibox.myqnapcloud.com #PracticalAI #AIBOXS", headline: "Practical AI, everyday value", topic: "ai", alt: "AI-assisted knowledge and operations tools appear in a practical business workspace." },
  { text: "Files, devices and workflows belong in the same conversation. AiBox Cloud helps teams build a more connected digital workspace. See how: https://aibox.myqnapcloud.com #CloudStorage #AIBOXS", headline: "A workspace that stays connected", topic: "storage", alt: "Cloud storage connects shared files and devices in a modern digital workspace." },
  { text: "From APIs to messaging platforms, integrations can reduce copy-paste work and make information easier to follow. Talk with AiBox: https://aibox.myqnapcloud.com #SystemIntegration #AIBOXS", headline: "Fewer disconnected steps", topic: "integration", alt: "API, messaging and business tools are joined into one clear workflow." },
  { text: "Plan the next digital step with a partner who understands how your systems fit together. AiBox supports cloud, software and automation projects. Learn more: https://aibox.myqnapcloud.com #AiBoxSolution #AIBOXS", headline: "Plan your next digital step", topic: "workflow", alt: "A sequence of cloud, software and automation milestones forms a project roadmap." },
  { text: "A connected storage setup can help people reach the files they need from the devices they use. Explore AiBox Cloud and QNAP services: https://aibox.myqnapcloud.com #QNAP #AiBoxCloud", headline: "Files across your devices", topic: "storage", alt: "A connected storage hub makes business files accessible across devices." },
  { text: "Discover AiBox Wallet, cloud services and the AIBOXS token ecosystem on Solana. Explore the services and tools behind AiBox: https://aibox.myqnapcloud.com #Web3 #AIBOXS", headline: "Connect cloud and Web3", topic: "wallet", alt: "Cloud and Web3 services meet in a polished digital ecosystem concept." },
  { text: "Good integrations let teams keep familiar tools while improving how information moves between them. See how AiBox can help: https://aibox.myqnapcloud.com #Integration #AiBoxSolution", headline: "Keep the tools. Improve the flow.", topic: "integration", alt: "Familiar business tools connect through a bright streamlined workflow." },
  { text: "Make everyday file management easier to follow with cloud storage and services built around how teams work. Explore AiBox Cloud: https://aibox.myqnapcloud.com #CloudStorage #AIBOXS", headline: "A clearer home for files", topic: "cloud", alt: "Files are organized within a clear cloud workspace for a business team." },
  { text: "Automation can start with one repeatable task. AiBox helps connect systems so routine work takes fewer steps. Discover AiBox Solution: https://aibox.myqnapcloud.com #Automation #AIBOXS", headline: "Start with one useful task", topic: "workflow", alt: "A repeatable business task moves through a simplified automation path." },
  { text: "Build a digital workspace that brings data, operations and communication closer together. AiBox supports practical system integration: https://aibox.myqnapcloud.com #DigitalWorkplace #AIBOXS", headline: "Bring the workspace together", topic: "integration", alt: "Data, operations and communication tools connect in a digital workplace." },
  { text: "AI can help teams find information and support customers when it is connected to the right workflow. Explore practical AiBox solutions: https://aibox.myqnapcloud.com #AI #AiBoxSolution", headline: "Connect AI to useful work", topic: "ai", alt: "An AI assistant connects business knowledge with service workflows." },
  { text: "Connect your cloud, NAS and daily business tools through services designed to work together. Discover AiBox and AIBOXS: https://aibox.myqnapcloud.com #QNAP #AIBOXS", headline: "Connect storage to services", topic: "storage", alt: "A NAS, cloud and business services connect around a central digital workspace." },
  { text: "AiBox helps businesses connect apps, data and processes with practical integration services. Start a conversation about your workflow: https://aibox.myqnapcloud.com #BusinessIntegration #AIBOXS", headline: "Make integration practical", topic: "integration", alt: "Business apps and data connect in a clean, practical integration diagram." },
  { text: "A better digital foundation can make the next project easier to build. Explore AiBox services for cloud, software and automation: https://aibox.myqnapcloud.com #DigitalInfrastructure #AIBOXS", headline: "A foundation for what is next", topic: "workflow", alt: "Cloud, software and automation form a stable base for future digital projects." },
  { text: "Explore AiBox Wallet and AIBOXS on Solana alongside a broader set of connected digital services. Learn more: https://aibox.myqnapcloud.com #AIBOXS #Solana", headline: "Discover AiBox Wallet", topic: "wallet", alt: "A digital wallet is presented within a polished connected-services ecosystem." },
  { text: "Bring the moving parts of your business closer together. AiBox Solution supports cloud, AI and integrations for practical workflows. Explore: https://aibox.myqnapcloud.com #AiBoxSolution #AIBOXS", headline: "Technology, working together", topic: "integration", alt: "Cloud, AI and business systems connect around one central AiBox workflow." }
];

async function gql(query) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { authorization: "Bearer " + apiKey, "content-type": "application/json" },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(20000)
  });
  const json = await response.json();
  if (!response.ok || json.errors?.length) {
    throw new Error("Buffer API request failed (" + response.status + "): " + JSON.stringify(json.errors ?? json).slice(0, 1200));
  }
  return json.data;
}

function bangkokUtcDate(date) {
  return new Date(date.toISOString().slice(0, 10) + "T" + String(bangkokUtcHour).padStart(2, "0") + ":00:00.000Z");
}
function addDays(date, count) {
  return new Date(date.getTime() + count * 86400000);
}
function dateString(date) {
  return date.toISOString().slice(0, 10);
}
function dayOffset(date) {
  return Math.floor((bangkokUtcDate(date).getTime() - bangkokUtcDate(new Date(anchorDate + "T00:00:00.000Z")).getTime()) / 86400000);
}
function latestBangkokDate(posts) {
  const dates = posts.map(post => new Date(post.dueAt)).filter(date => !Number.isNaN(date.getTime())).sort((a, b) => b - a);
  return dates.length ? bangkokUtcDate(dates[0]) : null;
}

const organizations = (await gql("query { account { organizations { id name } } }")).account.organizations;
let target = null;
for (const organization of organizations) {
  const channels = (await gql(
    "query { channels(input: { organizationId: " + JSON.stringify(organization.id) + " }) { id name displayName service isQueuePaused } }"
  )).channels;
  for (const channel of channels) {
    const label = (channel.name + " " + (channel.displayName ?? "")).toLowerCase().replace(/^@/, "");
    if (channel.id === targetChannelId && channel.service.toLowerCase() === "instagram" && label.includes(targetHandle)) {
      if (target) throw new Error("More than one matching Instagram channel was returned. No post was created.");
      target = { organization, channel };
    }
  }
}
if (!target) throw new Error("The expected Buffer Instagram channel @aiboxtoken was not found. No post was created.");
if (target.channel.isQueuePaused) throw new Error("The @aiboxtoken Instagram queue is paused. No post was created.");

const postResult = await gql(
  "query { posts(first: 100, input: { organizationId: " + JSON.stringify(target.organization.id) +
  ", filter: { status: [scheduled], channelIds: [" + JSON.stringify(target.channel.id) + "] } }) { edges { node { id text dueAt channelId } } } }"
);
const scheduled = postResult.posts.edges.map(edge => edge.node);
if (scheduled.length > queueTarget) throw new Error("Queue is above the configured target; no post was created.");
if (scheduled.length === queueTarget) {
  console.log("No action: @aiboxtoken already has 10 scheduled posts.");
  process.exit(0);
}

const latest = latestBangkokDate(scheduled);
let nextDate;
if (latest) {
  nextDate = addDays(latest, 1);
} else {
  const now = new Date();
  const nowBkk = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  const today = new Date(nowBkk.getFullYear(), nowBkk.getMonth(), nowBkk.getDate());
  nextDate = bangkokUtcDate(today);
  const todaySlot = new Date(dateString(nextDate) + "T" + String(bangkokUtcHour).padStart(2, "0") + ":00:00.000Z");
  if (todaySlot.getTime() <= now.getTime()) nextDate = addDays(nextDate, 1);
}

const plans = [];
for (let i = 0; i < queueTarget - scheduled.length; i++) {
  const dueDate = addDays(nextDate, i);
  const index = ((dayOffset(dueDate) % content.length) + content.length) % content.length;
  const item = content[index];
  const date = dateString(dueDate);
  const relativeImagePath = join(imageDirectory, date + ".png");
  plans.push({
    date,
    dueAt: date + "T01:00:00.000Z",
    imagePath: relativeImagePath,
    imageUrl: "https://raw.githubusercontent.com/" + repo + "/main/" + relativeImagePath,
    item
  });
  if (!existsSync(relativeImagePath)) {
    execFileSync("python3", ["scripts/generate-buffer-instagram-image.py", date, item.headline, item.topic, relativeImagePath], { stdio: "inherit" });
  }
}

if (plans.length) {
  execFileSync("git", ["config", "user.name", "github-actions[bot]"]);
  execFileSync("git", ["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]);
  execFileSync("git", ["add", imageDirectory]);
  const staged = execFileSync("git", ["diff", "--cached", "--name-only"], { encoding: "utf8" }).trim();
  if (staged) {
    try {
      execFileSync("git", ["commit", "-m", "Add daily Buffer Instagram creative assets"], { stdio: "inherit" });
      execFileSync("git", ["push"], { stdio: "inherit" });
    } catch (error) {
      throw new Error("Could not publish the generated Instagram image to the public repository: " + String(error).slice(0, 500));
    }
  }
}

for (const plan of plans) {
  let available = false;
  for (let attempt = 0; attempt < 10 && !available; attempt++) {
    try {
      const response = await fetch(plan.imageUrl, { method: "HEAD", signal: AbortSignal.timeout(10000) });
      available = response.ok;
    } catch {
      available = false;
    }
    if (!available) await new Promise(resolve => setTimeout(resolve, 2500));
  }
  if (!available) throw new Error("Generated image is not publicly reachable yet: " + plan.imageUrl);
}

for (const plan of plans) {
  const mutation =
    "mutation { createPost(input: {" +
    " text: " + JSON.stringify(plan.item.text) +
    " channelId: " + JSON.stringify(target.channel.id) +
    " schedulingType: automatic mode: customScheduled dueAt: " + JSON.stringify(plan.dueAt) +
    " assets: [{ image: { url: " + JSON.stringify(plan.imageUrl) + " metadata: { altText: " + JSON.stringify(plan.item.alt) + " } } }]" +
    " metadata: { instagram: { type: post shouldShareToFeed: true isAiGenerated: false } }" +
    " }) { ... on PostActionSuccess { post { id text dueAt channelId status assets { id mimeType } } } ... on MutationError { message } } }";
  const result = await gql(mutation);
  const post = result.createPost?.post;
  if (!post) throw new Error("Buffer did not confirm post creation: " + (result.createPost?.message ?? "unknown response"));
  if (post.channelId !== target.channel.id || post.status !== "scheduled" || !post.assets?.length) {
    throw new Error("Buffer returned an unexpected channel, status or media set for " + plan.date + ".");
  }
  console.log("Scheduled @aiboxtoken for " + post.dueAt + " with image " + plan.imagePath + ".");
}
console.log("Refill complete: @aiboxtoken has " + queueTarget + " scheduled posts.");
