var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import session from "express-session";
import PostgresqlStore from "connect-pg-simple";

// server/db.ts
import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  ASSET_CATEGORIES: () => ASSET_CATEGORIES,
  CATEGORIES: () => CATEGORIES,
  EQUIPMENT_CATEGORIES: () => EQUIPMENT_CATEGORIES,
  ITEM_STATUSES: () => ITEM_STATUSES,
  activityLogs: () => activityLogs,
  categories: () => categories,
  damageReports: () => damageReports,
  damageReportsRelations: () => damageReportsRelations,
  insertActivityLogSchema: () => insertActivityLogSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertDamageReportSchema: () => insertDamageReportSchema,
  insertItemEditHistorySchema: () => insertItemEditHistorySchema,
  insertItemSchema: () => insertItemSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertReservationSchema: () => insertReservationSchema,
  insertReservationStatusHistorySchema: () => insertReservationStatusHistorySchema,
  insertUserSchema: () => insertUserSchema,
  itemEditHistory: () => itemEditHistory,
  itemEditHistoryRelations: () => itemEditHistoryRelations,
  items: () => items,
  notifications: () => notifications,
  reservationStatusHistory: () => reservationStatusHistory,
  reservationStatusHistoryRelations: () => reservationStatusHistoryRelations,
  reservations: () => reservations,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  email: text("email").notNull(),
  name: text("name").notNull(),
  department: text("department")
});
var items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  barcode: text("barcode").notNull().unique(),
  productName: text("product_name").notNull(),
  productType: text("product_type").notNull(),
  status: text("status").notNull().default("Available"),
  location: text("location"),
  notes: text("notes"),
  quantity: text("quantity").notNull().default("1"),
  isEquipment: boolean("is_equipment").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`)
});
var reservations = pgTable("reservations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"),
  requestDate: timestamp("request_date").notNull().default(sql`CURRENT_TIMESTAMP`),
  approvalDate: timestamp("approval_date"),
  startDate: date("start_date").notNull(),
  returnDate: date("return_date").notNull(),
  startTime: text("start_time"),
  returnTime: text("return_time"),
  purposeOfUse: text("purpose_of_use"),
  notes: text("notes"),
  rejectionReason: text("rejection_reason"),
  itemConditionOnReceive: text("item_condition_on_receive"),
  itemConditionOnReturn: text("item_condition_on_return"),
  returnNotes: text("return_notes"),
  checkoutDate: timestamp("checkout_date"),
  returnedDate: timestamp("returned_date")
});
var categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  image: text("image").notNull(),
  subTypes: text("sub_types").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  isEquipment: boolean("is_equipment").notNull().default(true),
  showQuantity: boolean("show_quantity").notNull().default(true),
  showLocation: boolean("show_location").notNull().default(true),
  showNotes: boolean("show_notes").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`)
});
var notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: text("is_read").notNull().default("false"),
  relatedId: varchar("related_id"),
  notificationFor: text("notification_for").notNull().default("user"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`)
});
var activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  oldStatus: text("old_status"),
  newStatus: text("new_status"),
  notes: text("notes"),
  timestamp: timestamp("timestamp").notNull().default(sql`CURRENT_TIMESTAMP`)
});
var itemEditHistory = pgTable("item_edit_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  fieldName: text("field_name").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  timestamp: timestamp("timestamp").notNull().default(sql`CURRENT_TIMESTAMP`)
});
var reservationStatusHistory = pgTable("reservation_status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reservationId: varchar("reservation_id").notNull().references(() => reservations.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  oldStatus: text("old_status"),
  newStatus: text("new_status").notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp").notNull().default(sql`CURRENT_TIMESTAMP`)
});
var damageReports = pgTable("damage_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id),
  reportedBy: varchar("reported_by").notNull().references(() => users.id),
  reportType: text("report_type").notNull(),
  severity: text("severity").notNull().default("medium"),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  resolvedAt: timestamp("resolved_at")
});
var damageReportsRelations = relations(damageReports, ({ one }) => ({
  reportedByUser: one(users, {
    fields: [damageReports.reportedBy],
    references: [users.id]
  }),
  item: one(items, {
    fields: [damageReports.itemId],
    references: [items.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true
});
var insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  requestDate: true,
  approvalDate: true
}).extend({
  startDate: z.union([z.date(), z.string().transform((val) => /* @__PURE__ */ new Date(val + "T00:00:00"))]),
  returnDate: z.union([z.date(), z.string().transform((val) => /* @__PURE__ */ new Date(val + "T00:00:00"))])
});
var insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});
var insertItemEditHistorySchema = createInsertSchema(itemEditHistory).omit({
  id: true,
  timestamp: true
});
var insertReservationStatusHistorySchema = createInsertSchema(reservationStatusHistory).omit({
  id: true,
  timestamp: true
});
var insertDamageReportSchema = createInsertSchema(damageReports).omit({
  id: true,
  createdAt: true,
  resolvedAt: true
});
var itemEditHistoryRelations = relations(itemEditHistory, ({ one }) => ({
  item: one(items, {
    fields: [itemEditHistory.itemId],
    references: [items.id]
  }),
  user: one(users, {
    fields: [itemEditHistory.userId],
    references: [users.id]
  })
}));
var reservationStatusHistoryRelations = relations(reservationStatusHistory, ({ one }) => ({
  reservation: one(reservations, {
    fields: [reservationStatusHistory.reservationId],
    references: [reservations.id]
  }),
  user: one(users, {
    fields: [reservationStatusHistory.userId],
    references: [users.id]
  })
}));
var ITEM_STATUSES = ["Available", "In Use", "Reserved", "Maintenance", "Disabled"];
var EQUIPMENT_CATEGORIES = {
  cameras: {
    name: "Cameras",
    subTypes: ["Camera", "Action Cam"],
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop"
  },
  lenses: {
    name: "Lenses",
    subTypes: ["Lenses", "Filter", "Digital Filter"],
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop"
  },
  tripods_stands: {
    name: "Tripods & Stands",
    subTypes: ["Stands", "Monopod", "Small Tripods", "Backdrop Stands"],
    image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&auto=format&fit=crop"
  },
  grips: {
    name: "Grips",
    subTypes: ["Crane", "Dolly / Wheels Tripod", "Shoulder Rig", "Spider Rig", "Gimbal", "Slider", "Rig", "Rig & Stabilization Gear", "Camera Support Equipment"],
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop"
  },
  audio: {
    name: "Audio",
    subTypes: ["Mic", "Microphone", "Wireless Device", "Recorder", "Mixer", "Boom Arm", "Transmitter", "Receiver"],
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop"
  },
  lighting: {
    name: "Lighting",
    subTypes: ["LED", "LED Light", "LED Ring", "RGB Lights", "Soft Box", "Light", "Lighting Equipment"],
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop"
  },
  studio_accessories: {
    name: "Studio Accessories",
    subTypes: ["Clapper", "Reflector", "Kit", "Background Screen"],
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&auto=format&fit=crop"
  },
  bags_cases: {
    name: "Bags & Cases",
    subTypes: ["Bag", "Bags & Cases", "Backpacks"],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop"
  },
  batteries_power: {
    name: "Batteries & Power",
    subTypes: ["Battery", "Charger", "Power Bank", "V-Mount Battery", "Battery Power Tester", "Power & Accessories", "Inverter"],
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop"
  },
  cables_adapters: {
    name: "Cables & Adapters",
    subTypes: ["Cable", "Socket", "Extension"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop"
  },
  monitors_displays: {
    name: "Monitors & Displays",
    subTypes: ["Monitor", "Screen", "Computing & Display"],
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop"
  },
  storage_devices: {
    name: "Storage Devices",
    subTypes: ["Storage Devices"],
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop"
  }
};
var ASSET_CATEGORIES = {
  softwares: {
    name: "Softwares",
    subTypes: ["Editing Software", "Design Software", "Office Software"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop"
  },
  office_supplies: {
    name: "Office Supplies",
    subTypes: ["Stationery", "Desk Items", "Printer Supplies"],
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop"
  },
  pantry: {
    name: "Pantry",
    subTypes: ["Snacks", "Disposable Items"],
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop"
  },
  transportation: {
    name: "Transportation",
    subTypes: ["Vehicles", "Delivery Equipment", "Travel Accessories"],
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop"
  },
  furniture: {
    name: "Furniture",
    subTypes: ["Chairs", "Tables", "Storage Units"],
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop"
  },
  communication: {
    name: "Communication",
    subTypes: ["SIM Cards", "Mobile Devices", "Internet Devices"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop"
  },
  uniforms_branding: {
    name: "Uniforms & Branding",
    subTypes: ["Uniforms", "Badges", "Tags", "T-Shirts", "Tote Bags", "Uniform Bags"],
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop"
  }
};
var CATEGORIES = { ...EQUIPMENT_CATEGORIES, ...ASSET_CATEGORIES };

// server/db.ts
import "dotenv/config";
var { Pool } = pkg;
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to set it in .env?");
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var db = drizzle(pool, { schema: schema_exports });

// server/routes.ts
import { createServer } from "http";
import { z as z2 } from "zod";
import QRCode from "qrcode";

// server/storage.ts
import { eq, and, desc, asc } from "drizzle-orm";
var MemStorage = class {
  constructor() {
  }
  async getUser(id) {
    return await db.query.users.findFirst({
      where: eq(users.id, id)
    });
  }
  async getUserByUsername(username) {
    return await db.query.users.findFirst({
      where: eq(users.username, username)
    });
  }
  async getAllUsers() {
    return await db.query.users.findMany({
      orderBy: [asc(users.name)]
    });
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, updates) {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }
  async deleteUser(id) {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }
  async getAllItems() {
    return await db.query.items.findMany({
      orderBy: [asc(items.productName)]
    });
  }
  async getItemById(id) {
    return await db.query.items.findFirst({
      where: eq(items.id, id)
    });
  }
  async getItemByBarcode(barcode) {
    return await db.query.items.findFirst({
      where: eq(items.barcode, barcode)
    });
  }
  async getItemsByCategory(categorySubTypes) {
    const allItems = await db.query.items.findMany();
    return allItems.filter((item) => categorySubTypes.includes(item.productType));
  }
  async createItem(insertItem) {
    const now = /* @__PURE__ */ new Date();
    const itemData = {
      ...insertItem,
      status: insertItem.status || "Available",
      location: insertItem.location || null,
      notes: insertItem.notes || null,
      createdAt: now,
      updatedAt: now
    };
    const [item] = await db.insert(items).values(itemData).returning();
    return item;
  }
  async updateItem(id, updates) {
    const [item] = await db.update(items).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(items.id, id)).returning();
    return item;
  }
  async deleteItem(id) {
    const result = await db.delete(items).where(eq(items.id, id)).returning();
    return result.length > 0;
  }
  async softDeleteItem(id, userId) {
    const [item] = await db.update(items).set({ status: "Disabled", updatedAt: /* @__PURE__ */ new Date() }).where(eq(items.id, id)).returning();
    return !!item;
  }
  async getAllReservations() {
    return await db.query.reservations.findMany({
      orderBy: [desc(reservations.requestDate)]
    });
  }
  async getReservationById(id) {
    return await db.query.reservations.findFirst({
      where: eq(reservations.id, id)
    });
  }
  async getReservationsByUser(userId) {
    return await db.query.reservations.findMany({
      where: eq(reservations.userId, userId)
    });
  }
  async getReservationsByItem(itemId) {
    return await db.query.reservations.findMany({
      where: eq(reservations.itemId, itemId)
    });
  }
  async createReservation(insertReservation) {
    const now = /* @__PURE__ */ new Date();
    const reservationData = {
      ...insertReservation,
      status: insertReservation.status || "pending",
      notes: insertReservation.notes || null,
      requestDate: now,
      approvalDate: null,
      rejectionReason: null,
      itemConditionOnReceive: null,
      itemConditionOnReturn: null
    };
    const [reservation] = await db.insert(reservations).values(reservationData).returning();
    return reservation;
  }
  async updateReservation(id, updates) {
    const [reservation] = await db.update(reservations).set(updates).where(eq(reservations.id, id)).returning();
    return reservation;
  }
  async checkReservationConflict(itemId, startDate, returnDate, excludeId) {
    const allReservations = await db.query.reservations.findMany({
      where: eq(reservations.itemId, itemId)
    });
    const itemReservations = allReservations.filter(
      (res) => res.status !== "rejected" && res.status !== "completed" && (!excludeId || res.id !== excludeId)
    );
    for (const res of itemReservations) {
      const resStart = new Date(res.startDate);
      const resEnd = new Date(res.returnDate);
      if (startDate >= resStart && startDate <= resEnd || returnDate >= resStart && returnDate <= resEnd || startDate <= resStart && returnDate >= resEnd) {
        return true;
      }
    }
    return false;
  }
  async createActivityLog(data) {
    try {
      const logData = {
        ...data,
        timestamp: /* @__PURE__ */ new Date()
      };
      const [log2] = await db.insert(activityLogs).values(logData).returning();
      return log2;
    } catch (error) {
      console.error("Error creating activity log:", error);
      console.error("Activity log data:", data);
      throw error;
    }
  }
  async getAllActivityLogs() {
    try {
      return await db.select({
        id: activityLogs.id,
        itemId: activityLogs.itemId,
        itemName: items.productName,
        itemBarcode: items.barcode,
        userId: activityLogs.userId,
        userName: users.name,
        userRole: users.role,
        userDepartment: users.department,
        action: activityLogs.action,
        oldStatus: activityLogs.oldStatus,
        newStatus: activityLogs.newStatus,
        notes: activityLogs.notes,
        timestamp: activityLogs.timestamp
      }).from(activityLogs).leftJoin(items, eq(activityLogs.itemId, items.id)).leftJoin(users, eq(activityLogs.userId, users.id)).orderBy(desc(activityLogs.timestamp));
    } catch (error) {
      console.error("Error getting activity logs:", error);
      return [];
    }
  }
  async getActivityLogsByItem(itemId) {
    try {
      return await db.select({
        id: activityLogs.id,
        itemId: activityLogs.itemId,
        userId: activityLogs.userId,
        userName: users.name,
        userRole: users.role,
        userDepartment: users.department,
        action: activityLogs.action,
        oldStatus: activityLogs.oldStatus,
        newStatus: activityLogs.newStatus,
        notes: activityLogs.notes,
        timestamp: activityLogs.timestamp
      }).from(activityLogs).leftJoin(users, eq(activityLogs.userId, users.id)).where(eq(activityLogs.itemId, itemId)).orderBy(desc(activityLogs.timestamp));
    } catch (error) {
      console.error("Error getting activity logs by item:", error);
      return [];
    }
  }
  async getAllCategories() {
    return await db.query.categories.findMany({
      orderBy: [asc(categories.name)]
    });
  }
  async getCategoryById(id) {
    return await db.query.categories.findFirst({
      where: eq(categories.id, id)
    });
  }
  async createCategory(data) {
    const [category] = await db.insert(categories).values(data).returning();
    return category;
  }
  async updateCategory(id, data) {
    const category = await this.getCategoryById(id);
    if (category && category.isDefault) {
      throw new Error("Cannot edit default categories.");
    }
    const [updatedCategory] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return updatedCategory;
  }
  async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    if (category && category.isDefault) {
      throw new Error("Cannot delete default categories.");
    }
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }
  async createNotification(data) {
    const [notification] = await db.insert(notifications).values({
      ...data,
      isRead: data.isRead || "false"
    }).returning();
    return notification;
  }
  async getNotificationsByUser(userId) {
    return await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)]
    });
  }
  async markNotificationAsRead(id) {
    await db.update(notifications).set({ isRead: "true" }).where(eq(notifications.id, id));
  }
  async markAllNotificationsAsRead(userId) {
    await db.update(notifications).set({ isRead: "true" }).where(eq(notifications.userId, userId));
  }
  async deleteNotification(id) {
    await db.delete(notifications).where(eq(notifications.id, id));
  }
  async getUnreadNotificationCount(userId) {
    const result = await db.query.notifications.findMany({
      where: and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, "false")
      )
    });
    return result.length;
  }
  async createItemEditHistory(data) {
    const [history] = await db.insert(itemEditHistory).values(data).returning();
    return history;
  }
  async getItemEditHistory(itemId) {
    const history = await db.query.itemEditHistory.findMany({
      where: eq(itemEditHistory.itemId, itemId),
      orderBy: [desc(itemEditHistory.timestamp)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });
    return history.map((h) => ({
      id: h.id,
      itemId: h.itemId,
      userId: h.userId,
      fieldName: h.fieldName,
      oldValue: h.oldValue,
      newValue: h.newValue,
      timestamp: h.timestamp,
      userName: h.user.name,
      userRole: h.user.role
    }));
  }
  async createReservationStatusHistory(data) {
    const [history] = await db.insert(reservationStatusHistory).values(data).returning();
    return history;
  }
  async getReservationStatusHistory(reservationId) {
    const history = await db.query.reservationStatusHistory.findMany({
      where: eq(reservationStatusHistory.reservationId, reservationId),
      orderBy: [desc(reservationStatusHistory.timestamp)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });
    return history.map((h) => ({
      id: h.id,
      reservationId: h.reservationId,
      userId: h.userId,
      oldStatus: h.oldStatus,
      newStatus: h.newStatus,
      notes: h.notes,
      timestamp: h.timestamp,
      userName: h.user.name,
      userRole: h.user.role
    }));
  }
  async createDamageReport(data) {
    const [report] = await db.insert(damageReports).values(data).returning();
    return report;
  }
  async getAllDamageReports() {
    const reports = await db.query.damageReports.findMany({
      orderBy: [desc(damageReports.createdAt)],
      with: {
        reportedByUser: {
          columns: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });
    return reports.map((r) => ({
      id: r.id,
      itemId: r.itemId,
      reportedBy: r.reportedBy,
      reportType: r.reportType,
      severity: r.severity,
      description: r.description,
      status: r.status,
      resolutionNotes: r.resolutionNotes,
      createdAt: r.createdAt,
      resolvedAt: r.resolvedAt,
      reportedByName: r.reportedByUser?.name,
      reportedByRole: r.reportedByUser?.role
    }));
  }
  async getDamageReportById(id) {
    return await db.query.damageReports.findFirst({
      where: eq(damageReports.id, id)
    });
  }
  async updateDamageReport(id, data) {
    const [report] = await db.update(damageReports).set({ ...data, resolvedAt: data.status === "resolved" ? /* @__PURE__ */ new Date() : void 0 }).where(eq(damageReports.id, id)).returning();
    return report;
  }
};
var storage = new MemStorage();

// server/auth.ts
import bcrypt from "bcrypt";
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
async function loginUser(username, password) {
  const user = await storage.getUserByUsername(username);
  if (!user) {
    return { success: false, message: "Invalid username or password" };
  }
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return { success: false, message: "Invalid username or password" };
  }
  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      name: user.name,
      department: user.department
    }
  };
}
function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
function requireAdmin(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.session.role !== "admin" && req.session.role !== "developer") {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }
  next();
}

// server/routes.ts
import { eq as eq2, desc as desc2 } from "drizzle-orm";

// server/emailService.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : void 0
});
async function sendEmail(options) {
  try {
    if (!process.env.SMTP_HOST) {
      console.log("\u{1F4E7} Email would be sent to:", options.to);
      console.log("   Subject:", options.subject);
      console.log("   Body:", options.html.substring(0, 100) + "...");
      return true;
    }
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@inventory.local",
      ...options
    });
    console.log("\u2705 Email sent to:", options.to);
    return true;
  } catch (error) {
    console.error("\u274C Error sending email:", error);
    return false;
  }
}
async function sendReservationRequestEmail(adminEmail, data) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #667eea; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #667eea; display: block; margin-bottom: 5px; }
          .value { margin-left: 20px; }
          .footer { margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Reservation Request</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Item:</span>
              <div class="value">${data.itemName}</div>
            </div>
            <div class="field">
              <span class="label">Requested By:</span>
              <div class="value">${data.userName}</div>
            </div>
            <div class="field">
              <span class="label">User Email:</span>
              <div class="value"><a href="mailto:${data.userEmail}">${data.userEmail}</a></div>
            </div>
            <div class="field">
              <span class="label">Start Date:</span>
              <div class="value">${data.startDate}</div>
            </div>
            <div class="field">
              <span class="label">Return Date:</span>
              <div class="value">${data.returnDate}</div>
            </div>
            ${data.notes ? `
            <div class="field">
              <span class="label">Notes:</span>
              <div class="value">${data.notes}</div>
            </div>
            ` : ""}
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              Please review this reservation request and approve or reject it in the system.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  return sendEmail({
    to: adminEmail,
    subject: `New Reservation Request for ${data.itemName}`,
    html
  });
}
async function sendReservationApprovedEmail(userEmail, data) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #22c55e; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #22c55e; display: block; margin-bottom: 5px; }
          .value { margin-left: 20px; }
          .footer { margin-top: 20px; font-size: 12px; color: #999; }
          .success { color: #22c55e; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Reservation Approved \u2713</h2>
          </div>
          <div class="content">
            <p class="success">Your reservation has been approved!</p>
            <div class="field">
              <span class="label">Item:</span>
              <div class="value">${data.itemName}</div>
            </div>
            <div class="field">
              <span class="label">Start Date:</span>
              <div class="value">${data.startDate}</div>
            </div>
            <div class="field">
              <span class="label">Return Date:</span>
              <div class="value">${data.returnDate}</div>
            </div>
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              Please pick up the item on the start date and ensure to return it in good condition by the return date.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  return sendEmail({
    to: userEmail,
    subject: `Your Reservation for ${data.itemName} Has Been Approved`,
    html
  });
}
async function sendReservationRejectedEmail(userEmail, data) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ef4444; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #ef4444; display: block; margin-bottom: 5px; }
          .value { margin-left: 20px; }
          .footer { margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Reservation Rejected</h2>
          </div>
          <div class="content">
            <p>Unfortunately, your reservation request has been rejected.</p>
            <div class="field">
              <span class="label">Item:</span>
              <div class="value">${data.itemName}</div>
            </div>
            <div class="field">
              <span class="label">Requested Period:</span>
              <div class="value">${data.startDate} to ${data.returnDate}</div>
            </div>
            ${data.rejectionReason ? `
            <div class="field">
              <span class="label">Reason:</span>
              <div class="value">${data.rejectionReason}</div>
            </div>
            ` : ""}
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              If you have any questions, please contact the administrator.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  return sendEmail({
    to: userEmail,
    subject: `Your Reservation for ${data.itemName} Has Been Rejected`,
    html
  });
}

// server/routes.ts
import { format } from "date-fns";
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      const result = await loginUser(username, password);
      if (!result.success) {
        return res.status(401).json({ error: result.message });
      }
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session error" });
        }
        req.session.userId = result.user.id;
        req.session.username = result.user.username;
        req.session.role = result.user.role;
        req.session.name = result.user.name;
        req.session.department = result.user.department;
        req.session.save((saveErr) => {
          if (saveErr) {
            return res.status(500).json({ error: "Failed to save session" });
          }
          res.json({
            user: result.user
          });
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
  app2.get("/api/auth/session", (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json({
      user: {
        id: req.session.userId,
        username: req.session.username,
        role: req.session.role,
        name: req.session.name
      }
    });
  });
  app2.get("/api/items", requireAuth, async (req, res) => {
    try {
      const category = req.query.category;
      const isEquipmentParam = req.query.isEquipment;
      let allItems = await storage.getAllItems();
      if (isEquipmentParam !== void 0) {
        const isEquipment = isEquipmentParam === "true";
        allItems = allItems.filter((item) => item.isEquipment === isEquipment);
      }
      if (category) {
        const dbCategories = await storage.getAllCategories();
        const defaultCategory = Object.values(EQUIPMENT_CATEGORIES).find((cat) => cat.name === category) || Object.values(ASSET_CATEGORIES).find((cat) => cat.name === category);
        const customCategory = dbCategories.find((cat) => cat.name === category);
        let subTypes = [];
        if (defaultCategory) {
          subTypes = [...defaultCategory.subTypes];
        } else if (customCategory) {
          subTypes = JSON.parse(customCategory.subTypes);
        }
        console.log(`Filtering category: ${category}`);
        console.log(`SubTypes for category:`, subTypes);
        console.log(`Total items:`, allItems.length);
        const filteredItems = allItems.filter((item) => {
          const matches = subTypes.includes(item.productType);
          if (matches) {
            console.log(`\u2713 Item "${item.productName}" (${item.productType}) matches category`);
          } else {
            console.log(`\u2717 Item "${item.productName}" (${item.productType}) does NOT match subTypes: ${JSON.stringify(subTypes)}`);
          }
          return matches;
        });
        console.log(`Filtered items count: ${filteredItems.length}`);
        res.json(filteredItems);
      } else {
        res.json(allItems);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });
  app2.get("/api/items/:id", requireAuth, async (req, res) => {
    try {
      const item = await storage.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Get item error:", error);
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });
  app2.post("/api/items", requireAdmin, async (req, res) => {
    try {
      console.log("\u{1F4DD} Item creation request:", JSON.stringify(req.body, null, 2));
      const validatedData = insertItemSchema.parse(req.body);
      console.log("\u2705 Validated data:", JSON.stringify(validatedData, null, 2));
      const item = await storage.createItem(validatedData);
      console.log("\u{1F4BE} Item created in DB:", JSON.stringify(item, null, 2));
      try {
        await storage.createActivityLog({
          itemId: item.id,
          userId: req.session.userId,
          action: "Item Created",
          oldStatus: null,
          newStatus: item.status,
          notes: `Item created: ${item.productName} - ${item.productType}. Created at ${(/* @__PURE__ */ new Date()).toLocaleString()}`
        });
      } catch (logError) {
        console.error("Failed to log item creation:", logError);
      }
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        console.error("\u274C Zod validation error:", error.errors);
        return res.status(400).json({ error: "Invalid item data", details: error.errors });
      }
      console.error("Create item error:", error);
      res.status(500).json({ error: "Failed to create item" });
    }
  });
  app2.patch("/api/items/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertItemSchema.partial().parse(req.body);
      const currentItem = await storage.getItemById(req.params.id);
      if (!currentItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      const item = await storage.updateItem(req.params.id, validatedData);
      const fieldsToTrack = ["productName", "productType", "status", "location", "notes", "barcode"];
      for (const field of fieldsToTrack) {
        if (validatedData[field] !== void 0 && validatedData[field] !== currentItem[field]) {
          try {
            await storage.createItemEditHistory({
              itemId: item.id,
              userId: req.session.userId,
              fieldName: field,
              oldValue: String(currentItem[field] || ""),
              newValue: String(validatedData[field] || "")
            });
          } catch (historyError) {
            console.error("Failed to log field change:", historyError);
          }
        }
      }
      if (validatedData.status && validatedData.status !== currentItem.status) {
        let action = "Status Updated";
        if (validatedData.status === "In Use" && currentItem.status === "Available") {
          action = "Checked Out (Manual)";
        } else if (validatedData.status === "Available" && currentItem.status === "In Use") {
          action = "Checked In (Manual)";
        } else if (validatedData.status === "Reserved") {
          action = "Marked as Reserved";
        } else if (validatedData.status === "Maintenance") {
          action = "Sent to Maintenance";
        } else if (validatedData.status === "Disabled") {
          action = "Disabled";
        }
        try {
          await storage.createActivityLog({
            itemId: item.id,
            userId: req.session.userId,
            action,
            oldStatus: currentItem.status,
            newStatus: validatedData.status,
            notes: `${item.productName}: ${currentItem.status} \u2192 ${validatedData.status}. Updated at ${(/* @__PURE__ */ new Date()).toLocaleString()}`
          });
        } catch (logError) {
          console.error("Failed to log status change:", logError);
        }
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid item data", details: error.errors });
      }
      console.error("Update item error:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  });
  app2.delete("/api/items/:id", requireAdmin, async (req, res) => {
    try {
      const item = await storage.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      const deleted = await storage.softDeleteItem(req.params.id, req.session.userId);
      try {
        await storage.createActivityLog({
          itemId: item.id,
          userId: req.session.userId,
          action: "Item Deleted (Soft)",
          oldStatus: item.status,
          newStatus: null,
          notes: `${item.productName} (${item.barcode}) moved to trash. Can be restored. Deleted at ${(/* @__PURE__ */ new Date()).toLocaleString()}`
        });
      } catch (logError) {
        console.error("Failed to log item deletion:", logError);
      }
      res.json({ success: true, deleted });
    } catch (error) {
      console.error("Delete item error:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });
  app2.post("/api/scan", requireAdmin, async (req, res) => {
    try {
      const schema = z2.object({
        barcode: z2.string().min(1, "Barcode is required")
      });
      const { barcode } = schema.parse(req.body);
      const item = await storage.getItemByBarcode(barcode);
      if (!item) {
        return res.json({
          success: false,
          error: `Item not found with barcode: ${barcode}`
        });
      }
      const oldStatus = item.status;
      let newStatus = oldStatus;
      let action = "";
      if (oldStatus === "Available") {
        newStatus = "In Use";
        action = "Checked Out";
      } else if (oldStatus === "In Use") {
        newStatus = "Available";
        action = "Checked In";
      } else if (oldStatus === "Reserved") {
        newStatus = "In Use";
        action = "Checked Out";
      } else {
        return res.json({
          success: false,
          error: `Item is currently ${oldStatus} and cannot be scanned`
        });
      }
      await storage.updateItem(item.id, { status: newStatus });
      try {
        await storage.createActivityLog({
          itemId: item.id,
          userId: req.session.userId,
          action: `${action} (QR Scan)`,
          oldStatus,
          newStatus,
          notes: `${item.productName} scanned via admin QR scanner. ${oldStatus} \u2192 ${newStatus}. Scanned at ${(/* @__PURE__ */ new Date()).toLocaleString()}`
        });
      } catch (logError) {
        console.error("Failed to log QR scan:", logError);
      }
      res.json({
        success: true,
        productName: item.productName,
        barcode: item.barcode,
        oldStatus,
        newStatus,
        action
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid scan data", details: error.errors });
      }
      console.error("Scan error:", error);
      res.status(500).json({ error: "Failed to process scan" });
    }
  });
  app2.get("/public/scan/:barcode", async (req, res) => {
    try {
      const { barcode } = req.params;
      const item = await storage.getItemByBarcode(barcode);
      if (!item) {
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Item Not Found</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                .container { background: white; color: #333; padding: 40px; border-radius: 20px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
                h1 { color: #ef4444; margin-bottom: 20px; }
                p { font-size: 18px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>\u274C Item Not Found</h1>
                <p>No item found with barcode: <strong>${barcode}</strong></p>
              </div>
            </body>
          </html>
        `);
      }
      const oldStatus = item.status;
      let newStatus = oldStatus;
      let action = "";
      let statusColor = "#3b82f6";
      if (oldStatus === "Available") {
        newStatus = "In Use";
        action = "Checked Out";
        statusColor = "#f59e0b";
      } else if (oldStatus === "In Use") {
        newStatus = "Available";
        action = "Checked In";
        statusColor = "#10b981";
      } else if (oldStatus === "Reserved") {
        newStatus = "In Use";
        action = "Checked Out";
        statusColor = "#f59e0b";
      } else {
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Cannot Process</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                .container { background: white; color: #333; padding: 40px; border-radius: 20px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
                h1 { color: #f59e0b; margin-bottom: 20px; }
                .status { background: #fef3c7; padding: 10px 20px; border-radius: 10px; display: inline-block; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>\u26A0\uFE0F Cannot Process</h1>
                <p><strong>${item.productName}</strong></p>
                <div class="status">Current Status: ${oldStatus}</div>
                <p>This item cannot be checked out/in at this time.</p>
              </div>
            </body>
          </html>
        `);
      }
      await storage.updateItem(item.id, { status: newStatus });
      const systemUser = await db.query.users.findFirst({
        where: eq2(users.role, "admin")
      });
      if (systemUser) {
        try {
          await storage.createActivityLog({
            itemId: item.id,
            userId: systemUser.id,
            action: `${action} (Public QR)`,
            oldStatus,
            newStatus,
            notes: `${item.productName} scanned via public QR code. ${oldStatus} \u2192 ${newStatus}. Scanned at ${(/* @__PURE__ */ new Date()).toLocaleString()}`
          });
        } catch (logError) {
          console.error("Failed to log public QR scan:", logError);
        }
      }
      const timestamp2 = (/* @__PURE__ */ new Date()).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short"
      });
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${action === "Checked Out" ? "Item Checked Out" : "Item Returned"} Successfully</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
              }
              .container { 
                background: white;
                padding: 40px;
                border-radius: 24px;
                max-width: 500px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.4s ease-out;
              }
              @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              .icon-container {
                width: 80px;
                height: 80px;
                margin: 0 auto 24px;
                background: ${action === "Checked Out" ? "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)"};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
              }
              @keyframes bounceIn {
                0% { transform: scale(0); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
              }
              h1 { 
                color: #111827;
                font-size: 28px;
                font-weight: 700;
                text-align: center;
                margin-bottom: 8px;
              }
              .subtitle {
                text-align: center;
                color: #6b7280;
                font-size: 16px;
                margin-bottom: 32px;
              }
              .info-card {
                background: #f9fafb;
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 24px;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .info-row:last-child { border-bottom: none; }
              .label {
                font-weight: 600;
                color: #6b7280;
                font-size: 14px;
              }
              .value {
                font-weight: 700;
                color: #111827;
                font-size: 14px;
                text-align: right;
                max-width: 60%;
                word-break: break-word;
              }
              .status-badge {
                background: ${statusColor};
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
              }
              .action-badge {
                background: ${action === "Checked Out" ? "#f59e0b" : "#10b981"};
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
              }
              .success-message {
                background: ${action === "Checked Out" ? "#fef3c7" : "#d1fae5"};
                color: ${action === "Checked Out" ? "#92400e" : "#065f46"};
                padding: 16px;
                border-radius: 12px;
                text-align: center;
                font-weight: 600;
                font-size: 15px;
                border: 2px solid ${action === "Checked Out" ? "#fbbf24" : "#34d399"};
              }
              .timestamp {
                text-align: center;
                color: #9ca3af;
                font-size: 13px;
                margin-top: 16px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon-container">
                ${action === "Checked Out" ? "\u{1F4E6}" : "\u2705"}
              </div>
              <h1>${action === "Checked Out" ? "Item Checked Out" : "Item Returned"} Successfully!</h1>
              <p class="subtitle">${item.productName}</p>

              <div class="info-card">
                <div class="info-row">
                  <span class="label">Barcode</span>
                  <span class="value">${item.barcode}</span>
                </div>
                <div class="info-row">
                  <span class="label">Product Type</span>
                  <span class="value">${item.productType}</span>
                </div>
                <div class="info-row">
                  <span class="label">Action</span>
                  <span class="action-badge">${action}</span>
                </div>
                <div class="info-row">
                  <span class="label">New Status</span>
                  <span class="status-badge">${newStatus}</span>
                </div>
              </div>

              <div class="success-message">
                ${action === "Checked Out" ? '\u{1F4E6} This item is now marked as "In Use" in the system' : '\u2728 This item is now marked as "Available" and ready for use'}
              </div>

              <div class="timestamp">
                ${timestamp2}
              </div>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Public scan error:", error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
              .container { background: white; color: #333; padding: 40px; border-radius: 20px; max-width: 500px; margin: 0 auto; }
              h1 { color: #ef4444; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Error</h1>
              <p>Failed to process scan. Please try again.</p>
            </div>
          </body>
        </html>
      `);
    }
  });
  app2.get("/api/categories", requireAuth, async (req, res) => {
    try {
      const isEquipmentParam = req.query.isEquipment;
      const allItems = await storage.getAllItems();
      const dbCategories = await storage.getAllCategories();
      let shouldShowEquipment = true;
      if (isEquipmentParam !== void 0) {
        shouldShowEquipment = isEquipmentParam === "true";
      }
      const defaultCategories = Object.values(CATEGORIES).filter((cat) => {
        const isEquipmentCategory = Object.values(EQUIPMENT_CATEGORIES).some((c) => c.name === cat.name);
        return shouldShowEquipment === isEquipmentCategory;
      }).map((cat) => {
        const categoryItems = allItems.filter(
          (item) => cat.subTypes.includes(item.productType)
        );
        return {
          name: cat.name,
          image: cat.image,
          subTypes: cat.subTypes,
          totalCount: categoryItems.length,
          availableCount: categoryItems.filter((item) => item.status === "Available").length,
          isCustom: false,
          isEquipment: shouldShowEquipment
        };
      });
      const customCategories = dbCategories.filter((cat) => {
        return shouldShowEquipment === cat.isEquipment;
      }).map((cat) => {
        const subTypes = JSON.parse(cat.subTypes);
        const categoryItems = allItems.filter(
          (item) => subTypes.includes(item.productType)
        );
        return {
          id: cat.id,
          name: cat.name,
          image: cat.image,
          subTypes,
          totalCount: categoryItems.length,
          availableCount: categoryItems.filter((item) => item.status === "Available").length,
          isCustom: true,
          isEquipment: cat.isEquipment
        };
      });
      const allCategories = [...defaultCategories, ...customCategories];
      console.log(`\u{1F4CB} GET /api/categories (isEquipment=${isEquipmentParam}):`, {
        shouldShowEquipment,
        defaultCategoriesCount: defaultCategories.length,
        customCategoriesCount: customCategories.length,
        totalCategoriesCount: allCategories.length,
        customCategories: customCategories.map((c) => ({ name: c.name, isEquipment: c.isEquipment }))
      });
      res.json(allCategories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  app2.post("/api/custom-categories", requireAdmin, async (req, res) => {
    try {
      console.log("\u{1F4DD} POST body:", JSON.stringify(req.body, null, 2));
      const validatedData = z2.object({
        name: z2.string().min(1, "Category name is required"),
        image: z2.string().url("Valid image URL is required"),
        subTypes: z2.array(z2.string()).min(1, "At least one product type is required"),
        isEquipment: z2.boolean().default(true)
      }).parse(req.body);
      const existingCategories = await storage.getAllCategories();
      const nameExists = existingCategories.some(
        (cat) => cat.name.toLowerCase() === validatedData.name.toLowerCase()
      );
      if (nameExists) {
        return res.status(400).json({ error: "A category with this name already exists" });
      }
      console.log("\u{1F4C1} Creating custom category with isEquipment:", validatedData.isEquipment);
      const category = await storage.createCategory({
        name: validatedData.name,
        image: validatedData.image,
        subTypes: JSON.stringify(validatedData.subTypes),
        isEquipment: validatedData.isEquipment,
        showQuantity: true,
        showLocation: true,
        showNotes: true
      });
      console.log("\u2705 Category created:", { name: category.name, isEquipment: category.isEquipment });
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          error: "Invalid category data",
          details: error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
        });
      }
      console.error("Create category error:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });
  app2.patch("/api/custom-categories/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = z2.object({
        name: z2.string().min(1).optional(),
        image: z2.string().url().optional(),
        subTypes: z2.array(z2.string()).optional(),
        isEquipment: z2.boolean().optional(),
        showQuantity: z2.boolean().optional(),
        showLocation: z2.boolean().optional(),
        showNotes: z2.boolean().optional()
      }).parse(req.body);
      const updateData = { ...validatedData };
      if (validatedData.subTypes) {
        updateData.subTypes = JSON.stringify(validatedData.subTypes);
      }
      const category = await storage.updateCategory(req.params.id, updateData);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      console.error("Update category error:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });
  app2.delete("/api/custom-categories/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });
  app2.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const notifications2 = await storage.getNotificationsByUser(req.session.userId);
      res.json(notifications2);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });
  app2.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });
  app2.patch("/api/notifications/read-all", requireAuth, async (req, res) => {
    try {
      await storage.markAllNotificationsAsRead(req.session.userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });
  app2.delete("/api/notifications/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteNotification(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete notification error:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });
  app2.get("/api/reservations", requireAuth, async (req, res) => {
    try {
      const reservations2 = await storage.getAllReservations();
      res.json(reservations2);
    } catch (error) {
      console.error("Get reservations error:", error);
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  });
  app2.get("/api/reservations/:id", requireAuth, async (req, res) => {
    try {
      const reservation = await storage.getReservationById(req.params.id);
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      res.json(reservation);
    } catch (error) {
      console.error("Get reservation error:", error);
      res.status(500).json({ error: "Failed to fetch reservation" });
    }
  });
  app2.get("/api/reservations/item/:itemId", requireAuth, async (req, res) => {
    try {
      const reservations2 = await storage.getReservationsByItem(req.params.itemId);
      const activeReservations = reservations2.filter(
        (r) => r.status === "pending" || r.status === "approved"
      );
      res.json(activeReservations);
    } catch (error) {
      console.error("Get item reservations error:", error);
      res.status(500).json({ error: "Failed to fetch item reservations" });
    }
  });
  app2.post("/api/reservations", requireAuth, async (req, res) => {
    try {
      console.log("\u{1F4DD} POST /api/reservations body:", req.body);
      console.log("\u{1F4DD} Session userId:", req.session.userId);
      const bodyData = req.body;
      const validatedData = insertReservationSchema.parse({
        ...bodyData,
        userId: req.session.userId
        // Override with session userId
      });
      const hasConflict = await storage.checkReservationConflict(
        validatedData.itemId,
        validatedData.startDate,
        validatedData.returnDate
      );
      if (hasConflict) {
        return res.status(409).json({
          error: "This item is already reserved for the selected dates. Please choose different dates."
        });
      }
      const reservation = await storage.createReservation(validatedData);
      const item = await storage.getItemById(validatedData.itemId);
      const oldStatus = item?.status || "Available";
      const user = await db.query.users.findFirst({
        where: eq2(users.id, validatedData.userId)
      });
      try {
        const admins = await db.query.users.findMany({
          where: eq2(users.role, "admin")
        });
        for (const admin of admins) {
          await storage.createNotification({
            userId: admin.id,
            type: "reservation_request",
            title: "New Reservation Request",
            message: `${user?.name || "A user"} has requested ${item?.productName || "an item"} from ${new Date(validatedData.startDate).toLocaleDateString()} to ${new Date(validatedData.returnDate).toLocaleDateString()}`,
            relatedId: reservation.id,
            isRead: "false",
            notificationFor: "admin"
          });
          if (admin.email) {
            await sendReservationRequestEmail(admin.email, {
              itemName: item?.productName || "Item",
              userName: user?.name || "User",
              userEmail: user?.email || "",
              startDate: format(new Date(validatedData.startDate), "MMM dd, yyyy"),
              returnDate: format(new Date(validatedData.returnDate), "MMM dd, yyyy"),
              notes: validatedData.notes
            });
          }
        }
      } catch (notifError) {
        console.error("Failed to create admin notifications:", notifError);
      }
      try {
        await storage.createActivityLog({
          itemId: validatedData.itemId,
          userId: validatedData.userId,
          action: "Reservation Created",
          oldStatus,
          newStatus: oldStatus,
          notes: `${item?.productName || "Item"} reservation requested by ${user?.name || "User"} from ${new Date(validatedData.startDate).toLocaleDateString()} to ${new Date(validatedData.returnDate).toLocaleDateString()}. Reservation Status: Pending (awaiting admin approval). Created at ${(/* @__PURE__ */ new Date()).toLocaleString()}`
        });
      } catch (logError) {
        console.error("Failed to log reservation creation:", logError);
      }
      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid reservation data", details: error.errors });
      }
      console.error("Create reservation error:", error);
      res.status(500).json({ error: "Failed to create reservation" });
    }
  });
  app2.patch("/api/reservations/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertReservationSchema.partial().extend({
        rejectionReason: z2.string().optional(),
        itemConditionOnReceive: z2.string().optional(),
        itemConditionOnReturn: z2.string().optional(),
        checkoutDate: z2.date().optional().or(z2.string().datetime().transform((str) => new Date(str))),
        returnedDate: z2.date().optional().or(z2.string().datetime().transform((str) => new Date(str))),
        returnNotes: z2.string().optional()
      }).parse(req.body);
      const currentReservation = await storage.getReservationById(req.params.id);
      if (!currentReservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      const reservation = await storage.updateReservation(req.params.id, validatedData);
      if (validatedData.status && validatedData.status !== currentReservation.status) {
        try {
          await storage.createReservationStatusHistory({
            reservationId: reservation.id,
            userId: req.session.userId,
            oldStatus: currentReservation.status,
            newStatus: validatedData.status,
            notes: validatedData.rejectionReason || `Status changed from ${currentReservation.status} to ${validatedData.status}`
          });
        } catch (historyError) {
          console.error("Failed to log reservation status change:", historyError);
        }
      }
      const item = await storage.getItemById(reservation.itemId);
      if (validatedData.status === "rejected") {
        await storage.updateItem(reservation.itemId, { status: "Available" });
        try {
          await storage.createNotification({
            userId: reservation.userId,
            type: "reservation_rejected",
            title: "Reservation Rejected",
            message: `Your reservation for ${item?.productName || "item"} has been rejected${validatedData.rejectionReason ? `: ${validatedData.rejectionReason}` : "."}`,
            relatedId: reservation.id,
            isRead: "false",
            notificationFor: "user"
          });
          const user = await db.query.users.findFirst({
            where: eq2(users.id, reservation.userId)
          });
          if (user?.email) {
            await sendReservationRejectedEmail(user.email, {
              itemName: item?.productName || "Item",
              userName: user.name,
              userEmail: user.email,
              startDate: format(new Date(reservation.startDate), "MMM dd, yyyy"),
              returnDate: format(new Date(reservation.returnDate), "MMM dd, yyyy"),
              rejectionReason: validatedData.rejectionReason
            });
          }
        } catch (notifError) {
          console.error("Failed to create rejection notification:", notifError);
        }
        try {
          await storage.createActivityLog({
            itemId: reservation.itemId,
            userId: req.session.userId,
            action: "Reservation Rejected",
            oldStatus: item?.status || "Reserved",
            newStatus: "Available",
            notes: `${item?.productName || "Item"} reservation rejected by ${req.session.name}${validatedData.rejectionReason ? `. Reason: ${validatedData.rejectionReason}` : ""}. Status: Reserved \u2192 Available. Updated at ${(/* @__PURE__ */ new Date()).toLocaleString()}`
          });
        } catch (logError) {
          console.error("Failed to log reservation status change:", logError);
        }
      } else if (validatedData.status === "completed") {
        await storage.updateItem(reservation.itemId, { status: "Available" });
        try {
          await storage.createActivityLog({
            itemId: reservation.itemId,
            userId: req.session.userId,
            action: "Equipment Return Confirmed",
            oldStatus: item?.status || "Reserved",
            newStatus: "Available",
            notes: `${item?.productName || "Item"} return confirmed by ${req.session.name}. Condition: ${validatedData.itemConditionOnReturn || "No notes provided"}. Status: Reserved \u2192 Available. Returned at ${(/* @__PURE__ */ new Date()).toLocaleString()}`
          });
        } catch (logError) {
          console.error("Failed to log return confirmation:", logError);
        }
      } else if (validatedData.checkoutDate && validatedData.itemConditionOnReceive !== void 0) {
        try {
          await storage.createActivityLog({
            itemId: reservation.itemId,
            userId: req.session.userId,
            action: "Equipment Receipt Confirmed",
            oldStatus: item?.status || "Reserved",
            newStatus: item?.status || "Reserved",
            notes: `${item?.productName || "Item"} received by ${req.session.name}. Condition: ${validatedData.itemConditionOnReceive || "No notes provided"}. Status remains: ${item?.status || "Reserved"}. Received at ${(/* @__PURE__ */ new Date()).toLocaleString()}`
          });
        } catch (logError) {
          console.error("Failed to log receipt confirmation:", logError);
        }
        try {
          await storage.createNotification({
            userId: reservation.userId,
            type: "equipment_received",
            title: "Equipment Received",
            message: `You have successfully received ${item?.productName || "equipment"}. Return by ${format(new Date(reservation.returnDate), "MMM dd, yyyy")} at ${reservation.returnTime || "17:00"}`,
            relatedId: reservation.id,
            isRead: "false",
            notificationFor: "user"
          });
        } catch (notifError) {
          console.error("Failed to create checkout notification:", notifError);
        }
      } else if (validatedData.status === "approved") {
        await storage.updateItem(reservation.itemId, { status: "Reserved" });
        try {
          await storage.createNotification({
            userId: reservation.userId,
            type: "reservation_approved",
            title: "Reservation Approved",
            message: `Your reservation for ${item?.productName || "item"} has been approved!`,
            relatedId: reservation.id,
            isRead: "false",
            notificationFor: "user"
          });
          const user = await db.query.users.findFirst({
            where: eq2(users.id, reservation.userId)
          });
          if (user?.email) {
            await sendReservationApprovedEmail(user.email, {
              itemName: item?.productName || "Item",
              userName: user.name,
              userEmail: user.email,
              startDate: format(new Date(reservation.startDate), "MMM dd, yyyy"),
              returnDate: format(new Date(reservation.returnDate), "MMM dd, yyyy")
            });
          }
        } catch (notifError) {
          console.error("Failed to create approval notification:", notifError);
        }
        try {
          await storage.createActivityLog({
            itemId: reservation.itemId,
            userId: req.session.userId,
            action: "Reservation Approved",
            oldStatus: item?.status || "Available",
            newStatus: "Reserved",
            notes: `${item?.productName || "Item"} reservation approved by ${req.session.name}. Status: ${item?.status} \u2192 Reserved. Approved at ${(/* @__PURE__ */ new Date()).toLocaleString()}`
          });
        } catch (logError) {
          console.error("Failed to log reservation approval:", logError);
        }
      }
      res.json(reservation);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid reservation data", details: error.errors });
      }
      console.error("Update reservation error:", error);
      res.status(500).json({ error: "Failed to update reservation" });
    }
  });
  app2.get("/api/items/:id/qrcode", requireAuth, async (req, res) => {
    try {
      const item = await storage.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      const publicUrl = `${req.protocol}://${req.get("host")}/public/scan/${item.barcode}`;
      const qrCodeUrl = await QRCode.toDataURL(publicUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });
      res.json({ qrCode: qrCodeUrl, barcode: item.barcode, publicUrl });
    } catch (error) {
      console.error("QR code generation error:", error);
      res.status(500).json({ error: "Failed to generate QR code" });
    }
  });
  app2.get("/api/qrcodes/all", requireAdmin, async (req, res) => {
    try {
      const items2 = await storage.getAllItems();
      const qrCodes = await Promise.all(
        items2.map(async (item) => {
          const publicUrl = `${req.protocol}://${req.get("host")}/public/scan/${item.barcode}`;
          const qrCode = await QRCode.toDataURL(publicUrl, {
            width: 300,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF"
            }
          });
          return {
            id: item.id,
            barcode: item.barcode,
            productName: item.productName,
            qrCode,
            publicUrl
          };
        })
      );
      res.json(qrCodes);
    } catch (error) {
      console.error("QR codes generation error:", error);
      res.status(500).json({ error: "Failed to generate QR codes" });
    }
  });
  const requireAdminOrDeveloper = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (req.session.role !== "developer" && req.session.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  };
  app2.get("/api/users", requireAdminOrDeveloper, async (req, res) => {
    try {
      const allUsers = await db.query.users.findMany({
        columns: {
          id: true,
          username: true,
          email: true,
          name: true,
          role: true,
          department: true
        }
      });
      res.json(allUsers);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", requireAdminOrDeveloper, async (req, res) => {
    try {
      const validatedData = z2.object({
        username: z2.string().min(3, "Username must be at least 3 characters"),
        password: z2.string().min(3, "Password must be at least 3 characters"),
        email: z2.string().email("Valid email is required"),
        name: z2.string().min(1, "Name is required"),
        role: z2.enum(["developer", "admin", "user"]).default("user"),
        department: z2.string().optional()
      }).parse(req.body);
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const hashedPassword = await hashPassword(validatedData.password);
      const [newUser] = await db.insert(users).values({
        username: validatedData.username,
        password: hashedPassword,
        email: validatedData.email,
        name: validatedData.name,
        role: validatedData.role,
        department: validatedData.department || null
      }).returning({
        id: users.id,
        username: users.username,
        email: users.email,
        name: users.name,
        role: users.role,
        department: users.department
      });
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          error: "Invalid user data",
          details: error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
        });
      }
      console.error("Create user error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });
  app2.patch("/api/users/:id", requireAdminOrDeveloper, async (req, res) => {
    try {
      const validatedData = z2.object({
        email: z2.string().email("Valid email is required").optional(),
        name: z2.string().min(1, "Name is required").optional(),
        role: z2.enum(["developer", "admin", "user"]).optional(),
        department: z2.string().optional()
      }).parse(req.body);
      const updateData = {};
      if (validatedData.email) updateData.email = validatedData.email;
      if (validatedData.name) updateData.name = validatedData.name;
      if (validatedData.role) updateData.role = validatedData.role;
      if (validatedData.department !== void 0) updateData.department = validatedData.department || null;
      const [updatedUser] = await db.update(users).set(updateData).where(eq2(users.id, req.params.id)).returning({
        id: users.id,
        username: users.username,
        email: users.email,
        name: users.name,
        role: users.role,
        department: users.department
      });
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          error: "Invalid user data",
          details: error.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
        });
      }
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });
  app2.delete("/api/users/:id", requireAdminOrDeveloper, async (req, res) => {
    try {
      if (req.params.id === req.session.userId) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      await db.delete(users).where(eq2(users.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });
  app2.get("/api/activity-logs", requireAuth, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let logs = await storage.getAllActivityLogs();
      if (startDate || endDate) {
        const start = startDate ? new Date(startDate) : /* @__PURE__ */ new Date(0);
        const end = endDate ? new Date(endDate) : new Date(Date.now() + 864e5);
        logs = logs.filter((log2) => {
          const logDate = new Date(log2.timestamp);
          return logDate >= start && logDate <= end;
        });
      }
      res.json(logs);
    } catch (error) {
      console.error("Get activity logs error:", error);
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  });
  app2.get("/api/activity-logs/item/:itemId", requireAuth, async (req, res) => {
    try {
      const logs = await storage.getActivityLogsByItem(req.params.itemId);
      res.json(logs);
    } catch (error) {
      console.error("Get item activity logs error:", error);
      res.status(500).json({ error: "Failed to fetch item activity logs" });
    }
  });
  app2.get("/api/item-edit-history/:itemId", requireAuth, async (req, res) => {
    try {
      const { itemId } = req.params;
      const history = await db.select({
        id: itemEditHistory.id,
        fieldName: itemEditHistory.fieldName,
        oldValue: itemEditHistory.oldValue,
        newValue: itemEditHistory.newValue,
        timestamp: itemEditHistory.timestamp,
        userName: users.name
      }).from(itemEditHistory).innerJoin(users, eq2(itemEditHistory.userId, users.id)).where(eq2(itemEditHistory.itemId, itemId)).orderBy(desc2(itemEditHistory.timestamp));
      res.json(history);
    } catch (error) {
      console.error("Get item edit history error:", error);
      res.status(500).json({ error: "Failed to get item edit history" });
    }
  });
  app2.get("/api/reservation-status-history/:reservationId", requireAuth, async (req, res) => {
    try {
      const { reservationId } = req.params;
      const history = await db.select({
        id: reservationStatusHistory.id,
        oldStatus: reservationStatusHistory.oldStatus,
        newStatus: reservationStatusHistory.newStatus,
        notes: reservationStatusHistory.notes,
        timestamp: reservationStatusHistory.timestamp,
        userName: users.name
      }).from(reservationStatusHistory).innerJoin(users, eq2(reservationStatusHistory.userId, users.id)).where(eq2(reservationStatusHistory.reservationId, reservationId)).orderBy(desc2(reservationStatusHistory.timestamp));
      res.json(history);
    } catch (error) {
      console.error("Get reservation status history error:", error);
      res.status(500).json({ error: "Failed to get reservation status history" });
    }
  });
  app2.get("/api/damage-reports", requireAuth, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let reports = await storage.getAllDamageReports();
      if (startDate || endDate) {
        const start = startDate ? new Date(startDate) : /* @__PURE__ */ new Date(0);
        const end = endDate ? new Date(endDate) : new Date(Date.now() + 864e5);
        reports = reports.filter((report) => {
          const reportDate = new Date(report.createdAt);
          return reportDate >= start && reportDate <= end;
        });
      }
      res.json(reports);
    } catch (error) {
      console.error("Get damage reports error:", error);
      res.status(500).json({ error: "Failed to fetch damage reports" });
    }
  });
  app2.post("/api/damage-reports", requireAuth, async (req, res) => {
    try {
      const validatedData = insertDamageReportSchema.parse(req.body);
      const report = await storage.createDamageReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid damage report data", details: error.errors });
      }
      console.error("Create damage report error:", error);
      res.status(500).json({ error: "Failed to create damage report" });
    }
  });
  app2.patch("/api/damage-reports/:id", requireAuth, async (req, res) => {
    try {
      const { status, resolutionNotes } = req.body;
      const report = await storage.updateDamageReport(req.params.id, { status, resolutionNotes });
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Update damage report error:", error);
      res.status(500).json({ error: "Failed to update damage report" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/seed.ts
async function seedDatabase() {
  console.log("\u{1F331} Seeding database...");
  const existingItems = await storage.getAllItems();
  if (existingItems.length > 0) {
    console.log("\u2705 Database already seeded, skipping...");
    return;
  }
  const equipmentCategories = [
    { name: "Cameras", image: "\u{1F4F7}", subTypes: JSON.stringify(["Camera", "Action Cam"]), isEquipment: true },
    { name: "Lenses", image: "\u{1F50D}", subTypes: JSON.stringify(["Lenses", "Digital Filter"]), isEquipment: true },
    { name: "Tripods & Stands", image: "\u{1F3A5}", subTypes: JSON.stringify(["Stands", "Small Tripods", "Backdrop Stands", "Monopod"]), isEquipment: true },
    { name: "Grips & Stabilization", image: "\u270B", subTypes: JSON.stringify(["Crane", "Gimbal", "Dolly / Wheels Tripod", "Shoulder Rig", "Spider Rig", "Slider", "Camera Support Equipment", "Rig & Stabilization Gear"]), isEquipment: true },
    { name: "Audio Equipment", image: "\u{1F3A4}", subTypes: JSON.stringify(["Microphone", "Mic", "Wireless Device", "Recorder", "Mixer", "Boom Arm", "Transmitter", "Receiver"]), isEquipment: true },
    { name: "Lighting", image: "\u{1F4A1}", subTypes: JSON.stringify(["LED Light", "LED", "Soft Box", "Light", "RGB Lights", "LED Ring", "Lighting Equipment"]), isEquipment: true },
    { name: "Studio Accessories", image: "\u{1F3AD}", subTypes: JSON.stringify(["Clapper", "Reflector", "Kit", "Background Screen"]), isEquipment: true },
    { name: "Bags & Cases", image: "\u{1F392}", subTypes: JSON.stringify(["Bag", "Backpacks", "Bags & Cases"]), isEquipment: true },
    { name: "Batteries & Power", image: "\u{1F50B}", subTypes: JSON.stringify(["V-Mount Battery", "Battery", "Charger", "Inverter", "Power Bank", "Battery Power Tester", "Power & Accessories"]), isEquipment: true },
    { name: "Cables & Adapters", image: "\u{1F50C}", subTypes: JSON.stringify(["Cable", "Socket", "Extension"]), isEquipment: true },
    { name: "Monitors & Displays", image: "\u{1F4FA}", subTypes: JSON.stringify(["Monitor", "Screen", "Computing & Display"]), isEquipment: true },
    { name: "Storage Devices", image: "\u{1F4BE}", subTypes: JSON.stringify(["Storage Devices"]), isEquipment: true }
  ];
  const assetCategories = [
    { name: "Software Licenses", image: "\u{1F4BB}", subTypes: JSON.stringify(["Editing Software", "Design Software", "Office Software"]), isEquipment: false },
    { name: "Office Supplies", image: "\u{1F4CE}", subTypes: JSON.stringify(["Stationery", "Desk Items", "Printer Supplies"]), isEquipment: false },
    { name: "Pantry Items", image: "\u{1F964}", subTypes: JSON.stringify(["Snacks", "Disposable Items"]), isEquipment: false },
    { name: "Transportation", image: "\u{1F69A}", subTypes: JSON.stringify(["Vehicles", "Delivery Equipment", "Travel Accessories"]), isEquipment: false },
    { name: "Furniture", image: "\u{1FA91}", subTypes: JSON.stringify(["Chairs", "Tables", "Storage Units"]), isEquipment: false },
    { name: "Communication Devices", image: "\u{1F4F1}", subTypes: JSON.stringify(["SIM Cards", "Internet Devices", "Mobile Devices"]), isEquipment: false },
    { name: "Uniforms & Branding", image: "\u{1F455}", subTypes: JSON.stringify(["Uniforms", "Badges", "Tags", "T-Shirts", "Tote Bags", "Uniform Bags"]), isEquipment: false }
  ];
  for (const category of [...equipmentCategories, ...assetCategories]) {
    await storage.createCategory(category);
    console.log(`  \u2713 Created category: ${category.name}`);
  }
  const users2 = [
    {
      username: "developer",
      password: await hashPassword("omg"),
      role: "developer",
      email: "developer@company.com",
      name: "System Developer"
    },
    {
      username: "admin",
      password: await hashPassword("omg"),
      role: "admin",
      email: "ironhub1746@gmail.com",
      name: "System Administrator"
    },
    {
      username: "staff1",
      password: await hashPassword("omg"),
      role: "user",
      email: "staff1@company.com",
      name: "Staff Member 1"
    },
    {
      username: "staff2",
      password: await hashPassword("omg"),
      role: "user",
      email: "staff2@company.com",
      name: "Staff Member 2"
    }
  ];
  for (const user of users2) {
    await storage.createUser(user);
    console.log(`  \u2713 Created user: ${user.username}`);
  }
  const items2 = [
    // 1. Cameras
    { barcode: "CAM-001", productName: "GH4 Lumix Cameras", productType: "Camera", status: "Available", location: "Studio A", notes: "Panasonic Lumix GH4", isEquipment: true },
    { barcode: "CAM-002", productName: "Canon 70D Camera", productType: "Camera", status: "Available", location: "Studio A", notes: "Canon DSLR Camera", isEquipment: true },
    { barcode: "ACAM-001", productName: "Insta 360 One R Lens Action Cam", productType: "Action Cam", status: "Available", location: "Equipment Room", notes: "360 degree action camera", isEquipment: true },
    // 2. Lenses
    { barcode: "LENS-001", productName: "CANON 50MM", productType: "Lenses", status: "Available", location: "Lens Cabinet", notes: "Prime lens", isEquipment: true },
    { barcode: "LENS-002", productName: "CANON 18-55", productType: "Lenses", status: "Available", location: "Lens Cabinet", notes: "Kit lens", isEquipment: true },
    { barcode: "LENS-003", productName: "CANON 85MM", productType: "Lenses", status: "Available", location: "Lens Cabinet", notes: "Portrait lens", isEquipment: true },
    { barcode: "LENS-004", productName: "CANON 18-135MM", productType: "Lenses", status: "Available", location: "Lens Cabinet", notes: "Zoom lens", isEquipment: true },
    { barcode: "LENS-005", productName: "CANON SIGMA DC 18-200MM", productType: "Lenses", status: "Available", location: "Lens Cabinet", notes: "All-purpose zoom", isEquipment: true },
    { barcode: "LENS-006", productName: "LUMIX 20MM", productType: "Lenses", status: "Available", location: "Lens Cabinet", notes: "Pancake lens", isEquipment: true },
    { barcode: "LENS-007", productName: "LUMIX 15MM", productType: "Lenses", status: "Available", location: "Lens Cabinet", notes: "Wide angle", isEquipment: true },
    { barcode: "LENS-008", productName: "LUMIX 14-140MM HD", productType: "Lenses", status: "Available", location: "Lens Cabinet", notes: "HD zoom lens", isEquipment: true },
    { barcode: "LENS-009", productName: "LUMIX 35-100MM", productType: "Lenses", status: "Available", location: "Lens Cabinet", notes: "Telephoto zoom", isEquipment: true },
    { barcode: "LENS-010", productName: "LUMIX G12-35MM", productType: "Lenses", status: "Available", location: "Lens Cabinet", notes: "Standard zoom", isEquipment: true },
    { barcode: "FILT-001", productName: "Digital Filter", productType: "Digital Filter", status: "Available", location: "Accessories Drawer", notes: "Digital lens filter", isEquipment: true },
    // 3. Tripods & Stands
    { barcode: "STND-001", productName: "LED Soft Box Stands (Average)", productType: "Stands", status: "Available", location: "Stand Storage", notes: "Medium height stands", isEquipment: true },
    { barcode: "STND-002", productName: "CAER AF2434 (H4)", productType: "Stands", status: "Available", location: "Stand Storage", notes: "Heavy duty stand", isEquipment: true },
    { barcode: "STND-003", productName: "Manfrotto 190 (Video Head Separate)", productType: "Stands", status: "Available", location: "Stand Storage", notes: "Professional tripod", isEquipment: true },
    { barcode: "STND-004", productName: "Soft Box Large Stand", productType: "Stands", status: "Available", location: "Stand Storage", notes: "Tall stand for softbox", isEquipment: true },
    { barcode: "STND-005", productName: "Sea Stands", productType: "Stands", status: "Available", location: "Stand Storage", notes: "Light stands", isEquipment: true },
    { barcode: "STND-006", productName: "Small Tripod", productType: "Small Tripods", status: "Available", location: "Equipment Room", notes: "Compact tripod", isEquipment: true },
    { barcode: "STND-007", productName: "Backdrop Stand (Large)", productType: "Backdrop Stands", status: "Available", location: "Studio B", notes: "Large backdrop support", isEquipment: true },
    { barcode: "MONO-001", productName: "CAER CF34DV with Head", productType: "Monopod", status: "Available", location: "Equipment Room", notes: "Professional monopod", isEquipment: true },
    // 4. Grips
    { barcode: "CRANE-001", productName: "iFootage Minicrane M1-111", productType: "Crane", status: "Available", location: "Equipment Storage", notes: "Camera crane", isEquipment: true },
    { barcode: "GIBL-001", productName: "Crane 3 S-Pro Gimbal", productType: "Gimbal", status: "Available", location: "Studio A", notes: "Professional gimbal", isEquipment: true },
    { barcode: "GIBL-002", productName: "DJI Ronin SC Gimbal", productType: "Gimbal", status: "Available", location: "Studio A", notes: "Compact gimbal", isEquipment: true },
    { barcode: "DOLLY-001", productName: "Dolly (Wheels Tripod)", productType: "Dolly / Wheels Tripod", status: "Available", location: "Equipment Storage", notes: "Camera dolly", isEquipment: true },
    { barcode: "DOLLY-002", productName: "Dolly (Small Tripod Wheels)", productType: "Dolly / Wheels Tripod", status: "Available", location: "Equipment Storage", notes: "Small dolly", isEquipment: true },
    { barcode: "SRIG-001", productName: "Shoulder Rig Kit Film City MB600", productType: "Shoulder Rig", status: "Available", location: "Equipment Room", notes: "Professional shoulder rig", isEquipment: true },
    { barcode: "SRIG-002", productName: "Neewer Shoulder Rig", productType: "Shoulder Rig", status: "Available", location: "Equipment Room", notes: "Budget shoulder rig", isEquipment: true },
    { barcode: "SRIG-003", productName: "Local Shoulder Rig", productType: "Shoulder Rig", status: "Available", location: "Equipment Room", notes: "Custom shoulder rig", isEquipment: true },
    { barcode: "SPRIG-001", productName: "Spider Rig", productType: "Spider Rig", status: "Available", location: "Equipment Storage", notes: "Spider camera rig", isEquipment: true },
    { barcode: "SLID-001", productName: "Electronic Slider Edelkrone", productType: "Slider", status: "Available", location: "Studio A", notes: "Motorized slider", isEquipment: true },
    { barcode: "SLID-002", productName: "Neewer Slider (Head)", productType: "Slider", status: "Available", location: "Studio A", notes: "Manual slider with head", isEquipment: true },
    { barcode: "SLID-003", productName: "Benro Slider MU005583", productType: "Slider", status: "Available", location: "Studio A", notes: "Carbon fiber slider", isEquipment: true },
    { barcode: "SLID-004", productName: "Small Slider Neewer", productType: "Slider", status: "Available", location: "Equipment Room", notes: "Compact slider", isEquipment: true },
    { barcode: "CSUP-001", productName: "Manfrotto 290 XTRA Tripod", productType: "Camera Support Equipment", status: "Available", location: "Stand Storage", notes: "Professional tripod", isEquipment: true },
    { barcode: "CSUP-002", productName: "Manfrotto 190 Go Tripod", productType: "Camera Support Equipment", status: "Available", location: "Stand Storage", notes: "Travel tripod", isEquipment: true },
    { barcode: "CSUP-003", productName: "Yunteng 288 Tripod", productType: "Camera Support Equipment", status: "Available", location: "Stand Storage", notes: "Budget tripod", isEquipment: true },
    { barcode: "CSUP-004", productName: "Benro Tripod with Head", productType: "Camera Support Equipment", status: "Available", location: "Stand Storage", notes: "Tripod with fluid head", isEquipment: true },
    { barcode: "RIG-001", productName: "Froza 60C", productType: "Rig", status: "Available", location: "Equipment Room", notes: "Camera rig accessory", isEquipment: true },
    { barcode: "RIG-002", productName: "Godex 60C", productType: "Rig", status: "Available", location: "Equipment Room", notes: "Camera rig accessory", isEquipment: true },
    { barcode: "RIG-003", productName: "Crane 3 S-Pro", productType: "Rig & Stabilization Gear", status: "Available", location: "Equipment Room", notes: "Stabilization rig", isEquipment: true },
    // 5. Audio
    { barcode: "MIC-001", productName: "Rode Mic", productType: "Microphone", status: "Available", location: "Audio Room", notes: "Professional microphone", isEquipment: true },
    { barcode: "MIC-002", productName: "Dodex VD-Mic", productType: "Microphone", status: "Available", location: "Audio Room", notes: "On-camera mic", isEquipment: true },
    { barcode: "MIC-003", productName: "Podcast Mic Blue", productType: "Microphone", status: "Available", location: "Podcast Room", notes: "USB podcast microphone", isEquipment: true },
    { barcode: "MIC-004", productName: "Neewer NW-700 Mic", productType: "Microphone", status: "Available", location: "Audio Room", notes: "Condenser microphone", isEquipment: true },
    { barcode: "MIC-005", productName: "LVI Lavalier Micro-Cravate MOVO", productType: "Mic", status: "Available", location: "Audio Room", notes: "Lavalier microphone", isEquipment: true },
    { barcode: "MIC-006", productName: "MOVO Wire-Mike Doll", productType: "Mic", status: "Available", location: "Audio Room", notes: "Wired lavalier", isEquipment: true },
    { barcode: "WMIC-001", productName: "Wireless Go II (Rode)", productType: "Wireless Device", status: "Available", location: "Audio Room", notes: "Wireless mic system", isEquipment: true },
    { barcode: "WMIC-002", productName: "WMIC60 Wireless Microphone", productType: "Wireless Device", status: "Available", location: "Audio Room", notes: "Wireless handheld mic", isEquipment: true },
    { barcode: "REC-001", productName: "Zoom H8 Handy Recorder", productType: "Recorder", status: "Available", location: "Audio Room", notes: "8-track recorder", isEquipment: true },
    { barcode: "REC-002", productName: "Zoom H6 Handy Recorder", productType: "Recorder", status: "Available", location: "Audio Room", notes: "6-track recorder", isEquipment: true },
    { barcode: "MIX-001", productName: "Mixing Console (4 Channel)", productType: "Mixer", status: "Available", location: "Audio Room", notes: "Audio mixer", isEquipment: true },
    { barcode: "BOOM-001", productName: "RODE Boom Arm", productType: "Boom Arm", status: "Available", location: "Audio Room", notes: "Studio boom arm", isEquipment: true },
    { barcode: "TXRX-001", productName: "RODE Link Transmitter RX-CAM / TX-BELT", productType: "Transmitter", status: "Available", location: "Audio Room", notes: "Wireless transmitter/receiver", isEquipment: true },
    { barcode: "TXRX-002", productName: "MOVO Kit (Transmitter/Receiver)", productType: "Receiver", status: "Available", location: "Audio Room", notes: "Wireless system", isEquipment: true },
    // 6. Lighting
    { barcode: "LED-001", productName: "LED 880 NiceFoto Kit", productType: "LED Light", status: "Available", location: "Lighting Room", notes: "LED panel kit", isEquipment: true },
    { barcode: "LED-002", productName: "LED Photostudio Pro LE500ACC", productType: "LED Light", status: "Available", location: "Lighting Room", notes: "Professional LED", isEquipment: true },
    { barcode: "LED-003", productName: "Godex S600 Kit Combo", productType: "LED", status: "Available", location: "Lighting Room", notes: "Complete LED kit", isEquipment: true },
    { barcode: "SOFT-001", productName: "Godox ADS 65W Soft Box", productType: "Soft Box", status: "Available", location: "Lighting Room", notes: "Small softbox", isEquipment: true },
    { barcode: "SOFT-002", productName: "Froza Softbox SB-FMM-60", productType: "Soft Box", status: "Available", location: "Lighting Room", notes: "Medium softbox", isEquipment: true },
    { barcode: "SOFT-003", productName: "Godex Soft Box P120L", productType: "Soft Box", status: "Available", location: "Lighting Room", notes: "Large parabolic softbox", isEquipment: true },
    { barcode: "LED-004", productName: "Godex Light SL 150Pi", productType: "Light", status: "Available", location: "Lighting Room", notes: "Video LED light", isEquipment: true },
    { barcode: "RING-001", productName: "Neewer LED Ring Flash", productType: "LED Ring", status: "Available", location: "Lighting Room", notes: "Ring light for photography", isEquipment: true },
    { barcode: "RGB-001", productName: "Godox Tube Kit 30cm", productType: "RGB Lights", status: "Available", location: "Lighting Room", notes: "RGB tube light small", isEquipment: true },
    { barcode: "RGB-002", productName: "Irmai RGB LED Video Light 60cm", productType: "RGB Lights", status: "Available", location: "Lighting Room", notes: "RGB tube light large", isEquipment: true },
    { barcode: "RGB-003", productName: "Aputure MT Pro", productType: "RGB Lights", status: "Available", location: "Lighting Room", notes: "RGB mini light", isEquipment: true },
    { barcode: "LED-005", productName: "Neewer CN-LUX360", productType: "LED", status: "Available", location: "Lighting Room", notes: "Dimmable LED panel", isEquipment: true },
    { barcode: "RGB-004", productName: "Godox R1 RGB", productType: "RGB Lights", status: "Available", location: "Lighting Room", notes: "Compact RGB light", isEquipment: true },
    { barcode: "LED-006", productName: "Godox LED64", productType: "LED", status: "Available", location: "Lighting Room", notes: "On-camera LED", isEquipment: true },
    { barcode: "LED-007", productName: "Yongnuo YN300 II", productType: "LED", status: "Available", location: "Lighting Room", notes: "Portable LED panel", isEquipment: true },
    { barcode: "LED-008", productName: "LS Photography PPH79", productType: "LED Light", status: "Available", location: "Lighting Room", notes: "Photography LED", isEquipment: true },
    { barcode: "LED-009", productName: "Infrared Vision VL-36L Hak", productType: "LED Light", status: "Available", location: "Lighting Room", notes: "IR capable LED", isEquipment: true },
    { barcode: "LED-010", productName: "Genaray LED-7100T", productType: "LED Light", status: "Available", location: "Lighting Room", notes: "Bi-color LED", isEquipment: true },
    { barcode: "LED-011", productName: "JYLED300S LED Light", productType: "LED Light", status: "Available", location: "Lighting Room", notes: "Studio LED panel", isEquipment: true },
    { barcode: "LED-012", productName: "Neewer CN-160", productType: "LED", status: "Available", location: "Lighting Room", notes: "Dimmable on-camera LED", isEquipment: true },
    { barcode: "LED-013", productName: "Neewer CN-304", productType: "LED", status: "Available", location: "Lighting Room", notes: "Large LED panel", isEquipment: true },
    { barcode: "LED-014", productName: "Speedlight NW-561", productType: "Light", status: "Available", location: "Lighting Room", notes: "Camera flash speedlight", isEquipment: true },
    { barcode: "LED-015", productName: "LED Stands (Economical)", productType: "Lighting Equipment", status: "Available", location: "Stand Storage", notes: "Budget light stands", isEquipment: true },
    { barcode: "LED-016", productName: "Foldio 360 Smart Turntable Light", productType: "Lighting Equipment", status: "Available", location: "Product Photography", notes: "Product photography turntable", isEquipment: true },
    // 7. Studio Accessories
    { barcode: "CLAP-001", productName: "Clapper Board", productType: "Clapper", status: "Available", location: "Production Office", notes: "Film slate", isEquipment: true },
    { barcode: "REF-001", productName: "Reflector Kit (Small)", productType: "Reflector", status: "Available", location: "Lighting Storage", notes: "Small reflector set", isEquipment: true },
    { barcode: "REF-002", productName: "Reflector Kit (Large)", productType: "Reflector", status: "Available", location: "Lighting Storage", notes: "Large reflector set", isEquipment: true },
    { barcode: "REF-003", productName: "Angler Reflector Kit", productType: "Kit", status: "Available", location: "Lighting Storage", notes: "Professional reflector kit", isEquipment: true },
    { barcode: "BG-001", productName: "Background Screen (Green/Black/White)", productType: "Background Screen", status: "Available", location: "Studio B", notes: "Triple backdrop set", isEquipment: true },
    { barcode: "BG-002", productName: "Cowboy Studio Green Screen", productType: "Background Screen", status: "Available", location: "Studio B", notes: "Chroma key backdrop", isEquipment: true },
    // 8. Bags & Cases
    { barcode: "BAG-001", productName: "Equipment Bag Think Tank", productType: "Bag", status: "Available", location: "Storage Room", notes: "Professional camera bag", isEquipment: true },
    { barcode: "BAG-002", productName: "Equipment Bag Tail", productType: "Bag", status: "Available", location: "Storage Room", notes: "Equipment transport bag", isEquipment: true },
    { barcode: "BAG-003", productName: "Back Bag", productType: "Backpacks", status: "Available", location: "Storage Room", notes: "Camera backpack", isEquipment: true },
    { barcode: "BAG-004", productName: "Carry Bag Small", productType: "Bag", status: "Available", location: "Storage Room", notes: "Small equipment bag", isEquipment: true },
    { barcode: "BAG-005", productName: "Medium Bag (Customized)", productType: "Bags & Cases", status: "Available", location: "Storage Room", notes: "Custom medium case", isEquipment: true },
    { barcode: "BAG-006", productName: "Stand Bag", productType: "Bag", status: "Available", location: "Stand Storage", notes: "Bag for light stands", isEquipment: true },
    { barcode: "BAG-007", productName: "Low Eprop Bag (Medium)", productType: "Bag", status: "Available", location: "Storage Room", notes: "Medium equipment bag", isEquipment: true },
    // 9. Batteries & Power
    { barcode: "BAT-001", productName: "V-Mount Battery S-8110S", productType: "V-Mount Battery", status: "Available", location: "Charging Station", notes: "High capacity V-mount", isEquipment: true },
    { barcode: "BAT-002", productName: "V-Mount Battery PB-M98S", productType: "V-Mount Battery", status: "Available", location: "Charging Station", notes: "Medium capacity V-mount", isEquipment: true },
    { barcode: "BAT-003", productName: "V-Mount Ion FB-BP-95W", productType: "V-Mount Battery", status: "Available", location: "Charging Station", notes: "Lithium ion V-mount", isEquipment: true },
    { barcode: "BAT-004", productName: "ZEGO BZ-95 Mini", productType: "Battery", status: "Available", location: "Battery Cabinet", notes: "Compact battery", isEquipment: true },
    { barcode: "BAT-005", productName: "Canon Camera Battery", productType: "Battery", status: "Available", location: "Battery Cabinet", notes: "Canon LP-E6 compatible", isEquipment: true },
    { barcode: "BAT-006", productName: "Lumix Battery GH4", productType: "Battery", status: "Available", location: "Battery Cabinet", notes: "Panasonic DMW-BLF19", isEquipment: true },
    { barcode: "BAT-007", productName: "Monitor and Light Battery", productType: "Battery", status: "Available", location: "Battery Cabinet", notes: "NP-F style battery", isEquipment: true },
    { barcode: "BAT-008", productName: "Energizer Cell AAA", productType: "Battery", status: "Available", location: "Battery Cabinet", notes: "AAA batteries pack", isEquipment: true },
    { barcode: "CHG-001", productName: "V-Mount Charger", productType: "Charger", status: "Available", location: "Charging Station", notes: "Dual bay V-mount charger", isEquipment: true },
    { barcode: "CHG-002", productName: "Energizer Cell Charger", productType: "Charger", status: "Available", location: "Charging Station", notes: "AA/AAA battery charger", isEquipment: true },
    { barcode: "INV-001", productName: "Godox LP750X Inverter", productType: "Inverter", status: "Available", location: "Power Room", notes: "Power inverter", isEquipment: true },
    { barcode: "PWR-001", productName: "Power Bank Anker PowerCore+", productType: "Power Bank", status: "Available", location: "Equipment Drawer", notes: "USB power bank", isEquipment: true },
    { barcode: "TEST-001", productName: "Battery Power Tester DLYFULLB2", productType: "Battery Power Tester", status: "Available", location: "Charging Station", notes: "Battery capacity tester", isEquipment: true },
    { barcode: "EXT-001", productName: "Extension Cords", productType: "Power & Accessories", status: "Available", location: "Power Room", notes: "Power extension set", isEquipment: true },
    { barcode: "EXT-002", productName: "Extension Roll", productType: "Power & Accessories", status: "Available", location: "Power Room", notes: "Long extension reel", isEquipment: true },
    // 10. Cables & Adapters
    { barcode: "CBL-001", productName: "HDMI Cable 15ft", productType: "Cable", status: "Available", location: "Cable Drawer", notes: "High speed HDMI cable", isEquipment: true },
    { barcode: "CBL-002", productName: "Audio Scale XLR AUX 3.5 Extension", productType: "Cable", status: "Available", location: "Audio Cables", notes: "XLR to 3.5mm cable", isEquipment: true },
    { barcode: "CBL-003", productName: "Blackmagic Video Assist Cable", productType: "Cable", status: "Available", location: "Cable Drawer", notes: "Video cable set", isEquipment: true },
    { barcode: "EXT-003", productName: "Small Extension Socket", productType: "Socket", status: "Available", location: "Power Room", notes: "Power strip small", isEquipment: true },
    { barcode: "EXT-004", productName: "Power Extension Cord", productType: "Extension", status: "Available", location: "Power Room", notes: "Standard extension cord", isEquipment: true },
    { barcode: "EXT-005", productName: "Extension Roll (Large)", productType: "Extension", status: "Available", location: "Power Room", notes: "Heavy duty extension reel", isEquipment: true },
    // 11. Monitors & Displays
    { barcode: "MON-001", productName: "Koolertron Small Monitor", productType: "Monitor", status: "Available", location: "Equipment Room", notes: "Portable field monitor", isEquipment: true },
    { barcode: "MON-002", productName: 'iPad Pro 11"', productType: "Screen", status: "Available", location: "Office", notes: "Tablet for monitoring", isEquipment: true },
    { barcode: "DISP-001", productName: 'iMac 27" (2019)', productType: "Computing & Display", status: "Available", location: "Editing Suite", notes: "Desktop workstation", isEquipment: true },
    { barcode: "DISP-002", productName: "Samsung LED Monitor U28", productType: "Computing & Display", status: "Available", location: "Editing Suite", notes: "4K monitor", isEquipment: true },
    // 12. Storage Devices
    { barcode: "STO-001", productName: "WD My Passport Ultra", productType: "Storage Devices", status: "Available", location: "IT Room", notes: "Portable HDD 2TB", isEquipment: true },
    { barcode: "STO-002", productName: "WD Elements 3221B", productType: "Storage Devices", status: "Available", location: "IT Room", notes: "Desktop HDD 3TB", isEquipment: true },
    { barcode: "STO-003", productName: "WD My Passport Wireless", productType: "Storage Devices", status: "Available", location: "IT Room", notes: "Wireless portable HDD", isEquipment: true },
    // 13. Softwares
    { barcode: "SOFT-101", productName: "Adobe Premiere Pro License", productType: "Editing Software", status: "Available", location: "Digital Assets", notes: "Video editing software", isEquipment: false },
    { barcode: "SOFT-102", productName: "Final Cut Pro License", productType: "Editing Software", status: "Available", location: "Digital Assets", notes: "Apple video editing", isEquipment: false },
    { barcode: "SOFT-103", productName: "Adobe Photoshop License", productType: "Design Software", status: "Available", location: "Digital Assets", notes: "Photo editing software", isEquipment: false },
    { barcode: "SOFT-104", productName: "Adobe Illustrator License", productType: "Design Software", status: "Available", location: "Digital Assets", notes: "Vector design software", isEquipment: false },
    { barcode: "SOFT-105", productName: "Microsoft Office 365", productType: "Office Software", status: "Available", location: "Digital Assets", notes: "Office productivity suite", isEquipment: false },
    // 14. Office Supplies
    { barcode: "OFF-001", productName: "Pens and Pencils Set", productType: "Stationery", status: "Available", location: "Office Supply Cabinet", notes: "Writing instruments", isEquipment: false },
    { barcode: "OFF-002", productName: "Notebooks A4", productType: "Stationery", status: "Available", location: "Office Supply Cabinet", notes: "Spiral notebooks", isEquipment: false },
    { barcode: "OFF-003", productName: "Sticky Notes Assorted", productType: "Stationery", status: "Available", location: "Office Supply Cabinet", notes: "Post-it notes", isEquipment: false },
    { barcode: "OFF-004", productName: "Desk Organizer", productType: "Desk Items", status: "Available", location: "Office", notes: "Desktop organization", isEquipment: false },
    { barcode: "OFF-005", productName: "Paper Clips & Binders", productType: "Desk Items", status: "Available", location: "Office Supply Cabinet", notes: "Office fasteners", isEquipment: false },
    { barcode: "OFF-006", productName: "Printer Paper A4 Ream", productType: "Printer Supplies", status: "Available", location: "Print Room", notes: "Copy paper 500 sheets", isEquipment: false },
    { barcode: "OFF-007", productName: "Ink Cartridges Set", productType: "Printer Supplies", status: "Available", location: "Print Room", notes: "Printer ink refills", isEquipment: false },
    // 15. Pantry
    { barcode: "PAN-001", productName: "Coffee & Tea Supplies", productType: "Snacks", status: "Available", location: "Pantry", notes: "Hot beverages", isEquipment: false },
    { barcode: "PAN-002", productName: "Snack Box Assorted", productType: "Snacks", status: "Available", location: "Pantry", notes: "Mixed snacks", isEquipment: false },
    { barcode: "PAN-003", productName: "Disposable Cups Pack", productType: "Disposable Items", status: "Available", location: "Pantry", notes: "Paper cups 100 count", isEquipment: false },
    { barcode: "PAN-004", productName: "Disposable Plates & Utensils", productType: "Disposable Items", status: "Available", location: "Pantry", notes: "Disposable dinnerware", isEquipment: false },
    // 16. Transportation
    { barcode: "TRANS-001", productName: "Company Van", productType: "Vehicles", status: "Available", location: "Parking Lot", notes: "Equipment transport van", isEquipment: false },
    { barcode: "TRANS-002", productName: "Delivery Dolly", productType: "Delivery Equipment", status: "Available", location: "Loading Dock", notes: "Hand truck for transport", isEquipment: false },
    { barcode: "TRANS-003", productName: "Equipment Cart", productType: "Delivery Equipment", status: "Available", location: "Storage", notes: "Rolling equipment cart", isEquipment: false },
    { barcode: "TRANS-004", productName: "Travel Case Set", productType: "Travel Accessories", status: "Available", location: "Storage Room", notes: "Protective travel cases", isEquipment: false },
    // 17. Furniture
    { barcode: "FURN-001", productName: "Office Chair Ergonomic", productType: "Chairs", status: "Available", location: "Office", notes: "Adjustable office chair", isEquipment: false },
    { barcode: "FURN-002", productName: "Director Chair Set", productType: "Chairs", status: "Available", location: "Studio", notes: "Folding director chairs", isEquipment: false },
    { barcode: "FURN-003", productName: "Conference Table", productType: "Tables", status: "Available", location: "Meeting Room", notes: "Large meeting table", isEquipment: false },
    { barcode: "FURN-004", productName: "Production Desk", productType: "Tables", status: "Available", location: "Studio", notes: "Work desk", isEquipment: false },
    { barcode: "FURN-005", productName: "Storage Cabinet Metal", productType: "Storage Units", status: "Available", location: "Equipment Room", notes: "Lockable storage cabinet", isEquipment: false },
    { barcode: "FURN-006", productName: "Shelving Unit", productType: "Storage Units", status: "Available", location: "Storage Room", notes: "5-tier metal shelving", isEquipment: false },
    // 18. Communication
    { barcode: "COMM-001", productName: "Company SIM Card Set", productType: "SIM Cards", status: "Available", location: "IT Office", notes: "Mobile data SIM cards", isEquipment: false },
    { barcode: "COMM-002", productName: "Portable WiFi Hotspot", productType: "Internet Devices", status: "Available", location: "Equipment Room", notes: "Mobile internet device", isEquipment: false },
    { barcode: "COMM-003", productName: "Spare Mobile Phone", productType: "Mobile Devices", status: "Available", location: "IT Office", notes: "Backup communication device", isEquipment: false },
    // 19. Uniforms & Branding
    { barcode: "UNI-001", productName: "Staff Uniform Shirt (S)", productType: "Uniforms", status: "Available", location: "Uniform Storage", notes: "Small size uniform", isEquipment: false },
    { barcode: "UNI-002", productName: "Staff Uniform Shirt (M)", productType: "Uniforms", status: "Available", location: "Uniform Storage", notes: "Medium size uniform", isEquipment: false },
    { barcode: "UNI-003", productName: "Staff Uniform Shirt (L)", productType: "Uniforms", status: "Available", location: "Uniform Storage", notes: "Large size uniform", isEquipment: false },
    { barcode: "UNI-004", productName: "Staff Uniform Shirt (XL)", productType: "Uniforms", status: "Available", location: "Uniform Storage", notes: "Extra large uniform", isEquipment: false },
    { barcode: "BRAND-001", productName: "Name Badges Set", productType: "Badges", status: "Available", location: "HR Office", notes: "Employee ID badges", isEquipment: false },
    { barcode: "BRAND-002", productName: "Luggage Tags", productType: "Tags", status: "Available", location: "Equipment Storage", notes: "Equipment identification tags", isEquipment: false },
    { barcode: "BRAND-003", productName: "Branded T-Shirts (Assorted)", productType: "T-Shirts", status: "Available", location: "Marketing Storage", notes: "Promotional t-shirts", isEquipment: false },
    { barcode: "BRAND-004", productName: "Branded Tote Bags", productType: "Tote Bags", status: "Available", location: "Marketing Storage", notes: "Company logo tote bags", isEquipment: false },
    { barcode: "BRAND-005", productName: "Uniform Storage Bags", productType: "Uniform Bags", status: "Available", location: "Uniform Storage", notes: "Individual uniform bags", isEquipment: false }
  ];
  for (const item of items2) {
    await storage.createItem(item);
    console.log(`  \u2713 Created item: ${item.productName}`);
  }
  console.log("\u2705 Database seeded successfully!");
  console.log(`\u{1F4CA} Total categories: ${equipmentCategories.length + assetCategories.length}`);
  console.log(`\u{1F4CA} Total items: ${items2.length}`);
}

// server/index.ts
var app = express2();
var PostgresStore = PostgresqlStore(session);
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
var isProduction = process.env.NODE_ENV === "production";
app.use(
  session({
    store: new PostgresStore({
      pool,
      tableName: "session",
      createTableIfMissing: true,
      ttl: 24 * 60 * 60 * 7
      // 7 days in seconds
    }),
    secret: process.env.SESSION_SECRET || "inventory-management-secret-key",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    proxy: isProduction,
    // Trust proxy on production (Render uses proxy)
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      // Use lax for cross-site cookie compatibility
      domain: isProduction ? void 0 : void 0
      // Don't restrict domain
    }
  })
);
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await seedDatabase();
  } catch (seedError) {
    console.error("\u26A0\uFE0F Database seeding failed (will retry on next start):", seedError);
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
