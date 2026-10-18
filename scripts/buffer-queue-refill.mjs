const apiKey = process.env.BUFFER_API_KEY;

if (!apiKey) {
  console.log("Skipped: BUFFER_API_KEY is not configured. No Buffer API request was made.");
  process.exit(0);
}

const endpoint = "https://api.buffer.com";
const targetHandle = "aiboxtoken";
const queueTarget = 10;
const utcPostHour = 1; // 08:00 Asia/Bangkok (UTC+7)
const anchorDay = "2026-10-19";

const images = [
  { url: "https://buffer-media-uploads.s3.amazonaws.com/6ad4a04e646572d04725cd6f/6ad4acc6654895c10f870a57", alt: "AiBox cloud connected to storage, AI, devices and automation nodes." },
  { url: "https://buffer-media-uploads.s3.amazonaws.com/6ad4a04e646572d04725cd6f/6ad4aafd654895c10f870447", alt: "AiBox cloud storage connecting files across a phone, laptop and tablet." },
  { url: "https://buffer-media-uploads.s3.amazonaws.com/6ad4a04e646572d04725cd6f/6ad4ab4836c91370ece60c59", alt: "Business app modules connected through a central AiBox integration hub." },
  { url: "https://buffer-media-uploads.s3.amazonaws.com/6ad4a04e646572d04725cd6f/6ad4ab657133f0ead139c85a", alt: "A connected workflow automating inventory, sales and operations." },
  { url: "https://buffer-media-uploads.s3.amazonaws.com/6ad4a04e646572d04725cd6f/6ad4ab82d103d0ee62fd64c9", alt: "AI organizing business documents, support messages and daily workflow tasks." },
  { url: "https://buffer-media-uploads.s3.amazonaws.com/6ad4a04e646572d04725cd6f/6ad4abb436c91370ece60da1", alt: "AIBOXS token at the center of a connected Web3 service network." },
  { url: "https://buffer-media-uploads.s3.amazonaws.com/6ad4a04e646572d04725cd6f/6ad4abd2d103d0ee62fd65d5", alt: "A compact NAS storage device connecting a cloud with everyday devices." },
  { url: "https://buffer-media-uploads.s3.amazonaws.com/6ad4a04e646572d04725cd6f/6ad4abf375e750ff04880871", alt: "Cloud, AI, automation and integration modules on one digital foundation." },
  { url: "https://buffer-media-uploads.s3.amazonaws.com/6ad4a04e646572d04725cd6f/6ad4ac2ed8551995456b35f0", alt: "Messaging, email, payment and data services flowing through one automation workflow." },
  { url: "https://buffer-media-uploads.s3.amazonaws.com/6ad4a04e646572d04725cd6f/6ad4ac49ef7f3f99d02aee0e", alt: "A digital services roadmap connecting an idea to cloud, software and automation." }
];

const content = [
  "Good technology should make work simpler. AiBox brings cloud, AI and integrations into practical workflows. Explore AiBox and AIBOXS on Solana: https://aibox.myqnapcloud.com #AiBox #AIBOXS",
  "Connect the tools your team already uses. AiBox helps bring Odoo, QNAP, payments and messaging into one smoother workflow. Discover AIBOXS: https://aibox.myqnapcloud.com #Integration #AIBOXS",
  "Make room for better work with AiBox Cloud storage and connected services. Explore the AiBox ecosystem and AIBOXS on Solana: https://aibox.myqnapcloud.com #Cloud #AIBOXS",
  "AI works best when it helps with a real task. AiBox builds practical AI and automation solutions for daily business operations. Learn about AIBOXS: https://aibox.myqnapcloud.com #AI #AIBOXS",
  "Spend less time moving information between apps. AiBox connects business systems into workflows built around your needs. Meet AIBOXS on Solana: https://aibox.myqnapcloud.com #Automation #AIBOXS",
  "From cloud services to Odoo integrations, AiBox helps organizations make technology work together. Explore the AIBOXS token: https://aibox.myqnapcloud.com #AiBox #AIBOXS",
  "Your files and workflows should work across devices. AiBox Cloud and QNAP services help keep your setup connected. Discover AIBOXS: https://aibox.myqnapcloud.com #CloudStorage #AIBOXS",
  "Building a digital service takes more than one tool. AiBox brings software, cloud and automation into a practical roadmap. Explore AIBOXS on Solana: https://aibox.myqnapcloud.com #Web3 #AIBOXS",
  "From email and messaging to payments and data, integrations can reduce repetitive steps. AiBox helps connect them. Learn about AIBOXS: https://aibox.myqnapcloud.com #SystemIntegration #AIBOXS",
  "Bring your business tools into a clearer workflow with AiBox Solution. Explore our services and the AIBOXS token on Solana: https://aibox.myqnapcloud.com #AiBoxSolution #AIBOXS",
  "A connected cloud can make everyday work easier to reach. AiBox combines storage with tools for business workflows. Discover AIBOXS: https://aibox.myqnapcloud.com #Cloud #AIBOXS",
  "Practical automation starts with understanding how your team works. AiBox connects systems to remove repetitive handoffs. Explore AIBOXS: https://aibox.myqnapcloud.com #Automation #AIBOXS",
  "Odoo becomes more useful when it fits your actual process. AiBox supports customization and integration for business teams. Meet AIBOXS: https://aibox.myqnapcloud.com #Odoo #AIBOXS",
  "Keep your digital services connected across devices and workflows with AiBox Cloud and integration support. Learn about AIBOXS: https://aibox.myqnapcloud.com #DigitalServices #AIBOXS",
  "AI should support people doing real work. AiBox explores useful applications for knowledge, service and operations. Discover AIBOXS on Solana: https://aibox.myqnapcloud.com #AI #AIBOXS",
  "Build a more connected stack with AiBox services for cloud storage, business software and integrations. Explore the AIBOXS ecosystem: https://aibox.myqnapcloud.com #Technology #AIBOXS",
  "A reliable workflow can connect tools without adding extra complexity. AiBox helps bridge business apps and services. Learn about AIBOXS: https://aibox.myqnapcloud.com #Integration #AIBOXS",
  "Plan cloud, software and automation together with AiBox Solution. Explore practical services and AIBOXS on Solana: https://aibox.myqnapcloud.com #AiBox #AIBOXS",
  "Store files, connect devices and simplify daily work with AiBox Cloud services. See how AIBOXS fits the AiBox ecosystem: https://aibox.myqnapcloud.com #CloudStorage #AIBOXS",
  "Every business has different systems to connect. AiBox helps shape integrations around your team's needs. Discover AIBOXS: https://aibox.myqnapcloud.com #BusinessTools #AIBOXS"
];

async function gql(query) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(20000)
  });
  const json = await response.json();
  if (!response.ok || json.errors?.length) {
    throw new Error(`Buffer API request failed (${response.status}): ${JSON.stringify(json.errors ?? json).slice(0, 1200)}`);
  }
  return json.data;
}

const organizations = (await gql(`
  query { account { organizations { id name } } }
`)).account.organizations;

const candidates = [];
for (const organization of organizations) {
  const channels = (await gql(`
    query {
      channels(input: { organizationId: ${JSON.stringify(organization.id)} }) {
        id name displayName service isQueuePaused
      }
    }
  `)).channels;
  for (const channel of channels) {
    const handle = `${channel.name} ${channel.displayName ?? ""}`.toLowerCase();
    if (channel.service.toLowerCase() === "twitter" && handle.includes(targetHandle)) {
      candidates.push({ organization, channel });
    }
  }
}

if (candidates.length !== 1) {
  throw new Error(`Expected one X channel matching @${targetHandle}; found ${candidates.length}. No post was created.`);
}

const { organization, channel } = candidates[0];
if (channel.isQueuePaused) {
  throw new Error("The @aiboxtoken Buffer queue is paused. No post was created.");
}

const result = await gql(`
  query {
    posts(
      first: 100
      input: {
        organizationId: ${JSON.stringify(organization.id)}
        filter: { status: [scheduled], channelIds: [${JSON.stringify(channel.id)}] }
        sort: [{ field: dueAt, direction: desc }]
      }
    ) {
      edges { node { id text dueAt channelId } }
    }
  }
`);

const scheduled = result.posts.edges.map(edge => edge.node);
if (scheduled.length >= queueTarget) {
  console.log(`No action: @${targetHandle} already has ${scheduled.length} scheduled posts.`);
  process.exit(0);
}
if (scheduled.length > queueTarget) {
  throw new Error("Queue is above the configured target; no post was created.");
}

function bangkokDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(date);
  return Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, p.value]));
}
function utcForBangkokDate(dateString) {
  return new Date(`${dateString}T${String(utcPostHour).padStart(2, "0")}:00:00.000Z`);
}
function addDays(date, count) {
  return new Date(date.getTime() + count * 86400000);
}
function dayString(date) {
  return date.toISOString().slice(0, 10);
}

let nextDate;
if (scheduled.length) {
  const latest = scheduled
    .filter(post => post.dueAt)
    .map(post => new Date(post.dueAt))
    .sort((a, b) => b - a)[0];
  if (!latest || Number.isNaN(latest.getTime())) {
    throw new Error("Could not determine the next Bangkok posting date; no post was created.");
  }
  nextDate = addDays(utcForBangkokDate(dayString(latest)), 1);
} else {
  const parts = bangkokDateParts(new Date());
  const todayBangkok = `${parts.year}-${parts.month}-${parts.day}`;
  nextDate = addDays(utcForBangkokDate(todayBangkok), 1);
}

const anchor = utcForBangkokDate(anchorDay);
let created = 0;
while (scheduled.length + created < queueTarget) {
  const currentDate = addDays(nextDate, created);
  const dayOffset = Math.floor((utcForBangkokDate(dayString(currentDate)) - anchor) / 86400000);
  const contentIndex = ((dayOffset % content.length) + content.length) % content.length;
  const imageIndex = ((dayOffset % images.length) + images.length) % images.length;
  const text = content[contentIndex];
  const image = images[imageIndex];
  const dueAt = utcForBangkokDate(dayString(currentDate)).toISOString();

  const mutation = await gql(`
    mutation {
      createPost(input: {
        text: ${JSON.stringify(text)}
        channelId: ${JSON.stringify(channel.id)}
        schedulingType: automatic
        mode: customScheduled
        dueAt: ${JSON.stringify(dueAt)}
        assets: [{ image: { url: ${JSON.stringify(image.url)} } }]
      }) {
        ... on PostActionSuccess {
          post { id text dueAt channelId status assets { id mimeType } }
        }
        ... on MutationError { message }
      }
    }
  `);

  const action = mutation.createPost;
  if (!action?.post) {
    throw new Error(`Buffer did not confirm post creation: ${action?.message ?? "unknown response"}`);
  }
  if (action.post.channelId !== channel.id || action.post.status !== "scheduled") {
    throw new Error("Buffer returned an unexpected channel or status after post creation.");
  }
  created += 1;
  console.log(`Scheduled post ${action.post.id} for @${targetHandle} at ${action.post.dueAt}; image asset count: ${action.post.assets?.length ?? 0}.`);
}
console.log(`Refill complete: @${targetHandle} now has ${scheduled.length + created} scheduled posts.`);
