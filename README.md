
# NestJS CRM Backend

A robust and secure Customer Relationship Management (CRM) backend API built with **NestJS**. This project demonstrates advanced security patterns, including RBAC, privilege escalation prevention, and system integrity safeguards.

---

## 🛡️ Security Architecture

Security is at the heart of this project. The system includes:

* **Role-Based Access Control (RBAC):** Granular permission management.
* **Privilege Escalation Protection:** Guards preventing unauthorized users from assigning permissions higher than their own.
* **System Integrity Safeguards:** Protection of critical system roles (e.g., preventing the deletion of Admin/Super Admin roles).
* **Self-Modification Prevention:** Middleware and service-level checks to prevent users from altering their own roles/permissions.

---

## 🔍 Security Logic Showcase

To ensure system stability, sensitive operations are protected with rigorous logic. Here is a glimpse of how we protect the system's role structure:

### 1. Privilege Escalation Prevention

We ensure that users cannot grant permissions that they do not possess themselves:

```typescript
// roles.service.ts
if (currentUser.role !== 'admin') { 
  const targetPermissions = await this.permissionRepository.findBy({ id: In(permissionIds) });
  const userPermissions = currentUser.permissions || []; 

  const hasInjectedHigherPermission = targetPermissions.some(
    (perm) => !userPermissions.includes(perm.slug) 
  );

  if (hasInjectedHigherPermission) {
    throw new BadRequestException('Security: You cannot assign permissions higher than your own.');
  }
}

```

### 2. System Integrity (Role Protection)

Preventing accidental deletion of core system roles:

```typescript
// roles.service.ts
async remove(id: number, currentUser: any): Promise<void> {
  if (id === 1 || id === 2) {
    throw new BadRequestException('Critical: Cannot delete system-essential roles.');
  }
  // Additional logic to verify hierarchy and prevent self-deletion
  if (currentUser.role === role.name) {
    throw new BadRequestException('Security: You cannot delete the role assigned to your account.');
  }
  await this.roleRepository.remove(role);
}

```

---

## 🚀 Key Features

* **Contacts & Deals Management:** Company-scoped data isolation.
* **Modular Architecture:** High maintainability and scalable structure.
* **Type-Safe APIs:** Full TypeScript integration.

## 🛠️ Getting Started

### Prerequisites

* Node.js (v18+)
* PostgreSQL

### Installation

1. **Clone:** `git clone [https://github.com/marwaai/first-nest-crm-.git](https://github.com/marwaai/first-nest-crm-.git)`
2. **Install:** `npm install`
3. **Configure:** Set up your `.env` file with DB credentials.
4. **Run:** `npm run start:dev`

---

## 🛣️ Roadmap

* [ ] Implement Refresh Tokens.
* [ ] Integrate Swagger for API Documentation.
* [ ] Add Rate Limiting.

---

**نصيحة تقنية:** هذا الـ README الآن يظهر للمسؤول عن التوظيف (Recruiter) أنكِ لستِ فقط "تعرفين NestJS"، بل تعرفين كيف تحمين النظام. هذا يعطي انطباعاً بأنكِ مبرمجة تهتمين بـ **"Best Practices"** وهذا هو جوهر الـ Senior Level Logic.

هل ترغبين في أن أقوم برفع هذا الـ README ليكون جاهزاً للنسخ مباشرة؟
