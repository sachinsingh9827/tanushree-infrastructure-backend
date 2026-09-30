import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/database.js";
import { env, requireEnv } from "../config/env.js";
import { Admin } from "../models/Admin.js";
import { PageContent } from "../models/PageContent.js";
import { SiteSettings } from "../models/SiteSettings.js";
import { Service } from "../models/Service.js";
import { Project } from "../models/Project.js";

async function seedAdmin() {
  requireEnv("SEED_ADMIN_EMAIL", env.seed.adminEmail);
  requireEnv("SEED_ADMIN_PASSWORD", env.seed.adminPassword);

  const passwordHash = await bcrypt.hash(env.seed.adminPassword, 12);

  await Admin.findOneAndUpdate(
    { email: env.seed.adminEmail.toLowerCase() },
    {
      $set: {
        name: "tanuenterprise Admin",
        email: env.seed.adminEmail.toLowerCase(),
        passwordHash,
        role: "superadmin",
        status: "active"
      }
    },
    { upsert: true, new: true }
  );
}

async function seedSettings() {
  await SiteSettings.findOneAndUpdate(
    { singletonKey: "site-settings" },
    {
      $setOnInsert: {
        companyName: "tanuenterprise",
        email: "info@example.com",
        phone: "+91 00000 00000",
        footerText: "Building dependable spaces with care and precision."
      }
    },
    { upsert: true }
  );
}

async function seedPages() {
  const pages = [
    {
      slug: "home",
      title: "Practical construction work with a CMS-ready website.",
      content:
        "<h2>Construction support from planning to handover</h2><p>We help clients move from idea to execution with clear scope, practical sequencing and site coordination that keeps every decision visible.</p><ul><li>Residential, commercial, renovation and interior work</li><li>Progress-focused coordination with contractors and site teams</li><li>Quality checks for materials, finishing and handover readiness</li></ul>",
      seoTitle: "tanuenterprise Construction Portfolio",
      seoDescription: "Construction, renovation and interior work with dependable planning, coordination and delivery."
    },
    {
      slug: "about",
      title: "About tanuenterprise",
      content:
        "<p>tanuenterprise is a construction and project delivery company focused on dependable planning, quality execution and long-term client trust.</p><p>We support residential, commercial, renovation and interior projects with clear communication, disciplined site coordination and careful attention to finishing details.</p>",
      seoTitle: "About tanuenterprise",
      seoDescription: "Learn about tanuenterprise, our construction services, project values and commitment to reliable delivery."
    },
    {
      slug: "services",
      title: "Builder services for practical project delivery.",
      content:
        "<h2>Services built around real site needs</h2><p>Every project needs the right mix of planning, materials, labour coordination and finishing supervision. Our services are designed to keep those moving parts aligned.</p><ul><li>New construction for residential and commercial spaces</li><li>Renovation, repair and interior finishing work</li><li>Project consultation, site supervision and execution support</li></ul>",
      seoTitle: "Construction Services",
      seoDescription: "Residential, commercial, renovation, interior, consultation and site supervision services."
    },
    {
      slug: "projects",
      title: "Portfolio projects across completed, ongoing and upcoming work.",
      content:
        "<h2>Work that shows planning, progress and finish</h2><p>Our project portfolio highlights different stages of construction delivery, from early planning to completed spaces ready for use.</p>",
      seoTitle: "Construction Projects",
      seoDescription: "Explore completed, ongoing and upcoming construction projects by tanuenterprise."
    },
    {
      slug: "gallery",
      title: "Project images and construction highlights.",
      content:
        "<h2>Visual progress from site to finish</h2><p>The gallery brings together construction progress, finished details, materials and site moments so visitors can quickly understand the quality and range of work.</p>",
      seoTitle: "Project Gallery",
      seoDescription: "View construction project images and highlights from tanuenterprise."
    },
    {
      slug: "contact",
      title: "Start your project conversation with our team.",
      content:
        "<h2>Tell us what you want to build</h2><p>Use the enquiry form to share your project type, location, budget range and expected timeline. The admin team can review every submission from the dashboard.</p>",
      seoTitle: "Contact tanuenterprise",
      seoDescription: "Share your construction, renovation or interior requirement with tanuenterprise."
    }
  ];

  await Promise.all(
    pages.map((page) =>
      PageContent.findOneAndUpdate(
        { slug: page.slug },
        {
          $setOnInsert: {
            ...page,
            status: "published"
          }
        },
        { upsert: true }
      )
    )
  );
}

async function seedServices() {
  const services = [
    "Residential Construction",
    "Commercial Construction",
    "Renovation",
    "Interior Work",
    "Project Consultation"
  ];

  await Promise.all(
    services.map((title, index) =>
      Service.findOneAndUpdate(
        { slug: title.toLowerCase().replaceAll(" ", "-") },
        {
          $setOnInsert: {
            title,
            shortDescription: `${title} services for modern building needs.`,
            status: "active",
            sortOrder: index + 1
          }
        },
        { upsert: true }
      )
    )
  );
}

async function seedProjects() {
  const projects = [
    ["Green Heights Residence", "Completed"],
    ["Urban Plaza Complex", "Ongoing"],
    ["Future Nest Villas", "Upcoming"]
  ];

  await Promise.all(
    projects.map(([title, status], index) =>
      Project.findOneAndUpdate(
        { slug: title.toLowerCase().replaceAll(" ", "-") },
        {
          $setOnInsert: {
            title,
            shortDescription: `${title} project by tanuenterprise.`,
            status,
            published: true,
            featured: index < 2,
            sortOrder: index + 1
          }
        },
        { upsert: true }
      )
    )
  );
}

async function run() {
  await connectDatabase();
  await seedAdmin();
  await seedSettings();
  await seedPages();
  await seedServices();
  await seedProjects();
  console.log("Seed completed");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
