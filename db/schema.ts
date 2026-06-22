import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const roasts = pgTable("roasts", {
  id: serial("id").primaryKey(),
  codeSnippet: text("code_snippet").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  roastText: text("roast_text").notNull(),
  feedback: text("feedback").notNull(), // JSON string array
  severityScore: integer("severity_score").notNull(),
  personality: varchar("personality", { length: 50 }).notNull().default('Senior Dev'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const battles = pgTable("battles", {
  id: serial("id").primaryKey(),
  code1: text("code1").notNull(),
  code2: text("code2").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  winner: integer("winner").notNull(), // 1 or 2
  roastText: text("roast_text").notNull(),
  severityScore: integer("severity_score").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
