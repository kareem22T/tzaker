
**Overview**
- **Auth**: All endpoints assume Bearer auth header: `Authorization: Bearer <token>`
- **Content-Type**: `application/json` for JSON payloads; `multipart/form-data` for file uploads.
- **Pagination**: query params `page` (1-based), `limit`, `sort` (e.g., `-createdAt`), `search`.
- **Common responses**:
  - 200 OK — success (GET/PUT)
  - 201 Created — resource created (POST)
  - 204 No Content — deletion success (DELETE)
  - 400 Bad Request — validation error
  - 401 Unauthorized — auth required/invalid
  - 404 Not Found — resource not found
  - 500 Internal Server Error — unexpected

**Pagination Response Schema**
- Example paginated response JSON:
```
{
  "items": [ ... ],
  "meta": {
    "total": 125,
    "page": 1,
    "limit": 20,
    "totalPages": 7
  }
}
```

---

**1) Applications**
- Resource: `applications`

- List (paginated)
  - GET `/api/applications?page=1&limit=20&status=pending&search=Sarah&sort=-createdAt`
  - Response 200:
  ```
  {
    "items": [
      {
        "id":"app-2",
        "userId":"user-2",
        "userName":"Marcus Johnson",
        "departmentId":"scriptwriting",
        "departmentName":"Scriptwriting",
        "status":"pending",
        "rating": null,
        "ratingComment": null,
        "steps": [ { "stepId":"...", "stepTitle":"...", "formData": {...}, "completed": false } ],
        "completionPercentage": 50,
        "createdAt":"2025-11-04T...",
        "updatedAt":"2025-11-09T..."
      }
    ],
    "meta": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 }
  }
  ```

- Get single
  - GET `/api/applications/{id}`
  - Response 200: single `Application` object (same as an item above).

- Create
  - POST `/api/applications`
  - Body:
  ```
  {
    "userId":"user-10",
    "userName":"Alicia Keys",
    "departmentId":"production",
    "departmentName":"Production",
    "status":"pending",
    "steps":[ /* optional initial steps */ ],
    "completionPercentage": 0
  }
  ```
  - Response 201:
  ```
  { "id":"app-99", ...created application... }
  ```

- Update
  - PUT `/api/applications/{id}`
  - Body: full application object or partial with fields to update:
  ```
  {
    "userName":"Alicia K.",
    "completionPercentage": 60,
    "steps": [ ... ] 
  }
  ```
  - Response 200: updated application.

- Delete
  - DELETE `/api/applications/{id}`
  - Response 204 No Content

- Bulk delete
  - DELETE `/api/applications` with body:
  ```
  { "ids": ["app-2", "app-5", "app-6"] }
  ```
  - Response 200:
  ```
  { "deleted": ["app-2","app-5"], "notFound": ["app-6"] }
  ```

- Update status (convenience endpoint)
  - PATCH `/api/applications/{id}/status`
  - Body:
  ```
  { "status": "approved" } // enum: pending|approved|rejected
  ```
  - Response 200: updated application

- Add rating
  - POST `/api/applications/{id}/rating`
  - Body:
  ```
  { "rating": 5, "comment": "Great submission." }
  ```
  - Response 200: updated application (with `rating` & `ratingComment`)

- Update individual step
  - PUT `/api/applications/{id}/steps/{stepId}`
  - Body:
  ```
  { "formData": { "scriptTitle": "New Title" }, "completed": true }
  ```
  - Response 200: updated application or updated step object

Notes:
- Validate `completionPercentage` (0-100).
- When updating steps, recalc `completionPercentage` server-side.

---

**2) Departments**
- Resource: `departments`

- List (paginated)
  - GET `/api/departments?page=1&limit=20&search=script`
  - Response 200:
  ```
  {
    "items": [
      {
        "id":"scriptwriting",
        "name":"Scriptwriting",
        "description":"...",
        "icon":"script-icon.png",
        "order": 1,
        "steps": [
          { "id":"step-1", "title":"Contact Information", "fields": [ /* schema */ ] }
        ],
        "createdAt":"..."
      }
    ],
    "meta": { "total": 5, "page":1, "limit":20, "totalPages":1 }
  }
  ```

- Get single
  - GET `/api/departments/{id}`
  - Response 200: department object

- Create
  - POST `/api/departments`
  - Body:
  ```
  {
    "id":"casting",
    "name":"Casting",
    "description":"Casting and talent management",
    "icon":"casting.png",
    "order": 4,
    "steps": [
      { "id":"casting-step-1", "title":"Basic Info", "fields":[ { "name":"contactName","type":"string" } ] }
    ]
  }
  ```
  - Response 201: created department

- Update
  - PUT `/api/departments/{id}`
  - Body: updated fields
  - Response 200: updated department

- Delete
  - DELETE `/api/departments/{id}`
  - Response 204

- Bulk delete
  - DELETE `/api/departments`
  - Body:
  ```
  { "ids": ["scriptwriting","production"] }
  ```
  - Response 200:
  ```
  { "deleted": ["scriptwriting"], "notFound": ["nonexistent-dept"] }
  ```

- Department steps management
  - Add step: POST `/api/departments/{id}/steps`
    - Body:
    ```
    { "id":"step-3", "title":"Script Upload", "fields":[ { "name":"scriptFile","type":"file" } ] }
    ```
    - Response 201: created step
  - Update step: PUT `/api/departments/{id}/steps/{stepId}`
  - Delete step: DELETE `/api/departments/{id}/steps/{stepId}`

Notes:
- Consider validating unique `id` per department and unique step ids inside department.
- Return 409 Conflict for duplicate ids.

---

**3) FAQs**
- Two related resources: `faq-categories` and `faqs`

Faq Categories:
- List (paginated)
  - GET `/api/faq-categories?page=1&limit=20`
- Create
  - POST `/api/faq-categories`
  - Body:
  ```
  { "id":"billing", "title":"Billing & Payments", "description":"...", "iconImage":"/icons/billing.png", "order": 3 }
  ```
  - Response 201: created category
- Update
  - PUT `/api/faq-categories/{id}`
- Delete
  - DELETE `/api/faq-categories/{id}` — also should delete child FAQs server-side
- Bulk delete
  - DELETE `/api/faq-categories`
  - Body:
  ```
  { "ids": ["general", "technical"] }
  ```
  - Response 200: `{ "deleted": ["general"], "deletedFaqs": ["faq-1", "faq-2"] }`

Faqs:
- List (paginated + by category)
  - GET `/api/faqs?page=1&limit=20&categoryId=general&search=editor`
- Get single
  - GET `/api/faqs/{id}`
- Create
  - POST `/api/faqs`
  - Body:
  ```
  {
    "id":"faq-10",
    "categoryId":"general",
    "question":"How to reset password?",
    "answer":"<p>Use the forgot password flow...</p>",
    "order": 4
  }
  ```
  - Response 201: created FAQ
- Update
  - PUT `/api/faqs/{id}`
- Delete
  - DELETE `/api/faqs/{id}`
- Bulk delete
  - DELETE `/api/faqs`
  - Body:
  ```
  { "ids": ["faq-1","faq-2"] }
  ```
  - Response 200:
  ```
  { "deleted": ["faq-1"], "notFound": [] }
  ```

Notes:
- Store HTML answers as HTML or sanitized markdown. Backend should sanitize incoming HTML to prevent XSS if stored as-is.
- When deleting a category, return list of removed FAQs.

---

**4) Contact Messages**
- Resource: `contact-messages`

- List (paginated)
  - GET `/api/contact-messages?page=1&limit=20&search=John`
  - Response 200: paginated messages

- Get single
  - GET `/api/contact-messages/{id}`

- Create (from public site)
  - POST `/api/contact-messages`
  - Body:
  ```
  {
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@example.com",
    "subject":"Question about pricing",
    "message":"I would like to know..."
  }
  ```
  - Response 201:
  ```
  { "id":"msg-123", "createdAt":"2025-12-12T..." }
  ```

- Delete
  - DELETE `/api/contact-messages/{id}` — Response 204

- Bulk delete
  - DELETE `/api/contact-messages` with body:
  ```
  { "ids": ["msg-1","msg-2"] }
  ```
  - Response 200:
  ```
  { "deleted":["msg-1","msg-2"] }
  ```

- Extra: mark message as read/archived
  - PATCH `/api/contact-messages/{id}/status`
  - Body:
  ```
  { "status":"archived" } // or "read"
  ```

Notes:
- Rate-limit create endpoint and validate email format.
- Consider spam protection (captcha) for public create.

---

**5) Site Content**
- Resource: `site-content`
- This is generally a single resource representing editable content for the site.

- Get all content
  - GET `/api/site-content`
  - Response 200:
  ```
  {
    "home": {
      "hero": {
        "image": "",
        "title":"Welcome to Our Platform",
        "description":"Discover ...",
        "buttonText":"Get Started",
        "buttonTarget":"#features"
      },
      "faqIds":[ "faq-1", "faq-2" ]
    },
    "contact": {
      "info": { "email":"contact@example.com", "phone":"...", "location":"..." },
      "faqIds": []
    },
    "cookiePolicy":"<p>...</p>",
    "termsOfService":"<p>...</p>",
    "privacyPolicy":"<p>...</p>"
  }
  ```

- Update whole content
  - PUT `/api/site-content`
  - Body: full `SiteContent` object
  - Response 200: updated site content

- Update partial fields
  - PATCH `/api/site-content/home/hero`
  - Body:
  ```
  { "title":"New Home Title", "buttonText":"Start Now" }
  ```
  - Response 200: updated hero object

- Update policies
  - PUT `/api/site-content/policies` or PATCH `/api/site-content/privacyPolicy`
  - Body: raw HTML string or JSON with `content` property, e.g.:
  ```
  { "privacyPolicy":"<p>New policy text</p>" }
  ```

Notes:
- Admin-only endpoints; ensure authorization and audit logs for changes.
- If images are uploaded (hero.image), accept `multipart/form-data` and return stored URL.

---

**Common Implementation Notes for Backend Developer**
- Use consistent ID types (string UUIDs or slug IDs). Provide deterministic or UUID approach.
- Pagination: return `meta` with `total`, `page`, `limit`, `totalPages`.
- Bulk delete: return arrays `deleted`, `notFound` (or `failed`) to indicate partial failures.
- Validation: return 400 with structured errors:
  ```
  { "errors": [{ "field":"email", "message":"Invalid email format" }] }
  ```
- Concurrency: use `updatedAt` timestamps and optional `If-Unmodified-Since` / ETag headers for optimistic concurrency if needed.
- Rate limiting and input sanitization (especially html fields like FAQ answers and policy content).
- File uploads: `/uploads` endpoint or accept multipart on resource endpoints that include files. Return `{ "url": "/uploads/..." }`.
- Security: require admin role for create/update/delete on protected resources; public POST only for contact messages.

---

If you want, I can:
- Export this as a Postman collection (JSON) or an OpenAPI 3.0 YAML file for direct handoff.
- Add example validation schemas (JSON Schema / Zod / Joi) for each payload.

Which format would you like for the handoff (Postman collection, OpenAPI spec, or plain doc)?