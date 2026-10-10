import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import { Prisma, PrismaClient, RoleCode } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

function promptForHiddenValue(label: string) {
  return new Promise<string>((resolve, reject) => {
    if (!stdin.isTTY) {
      reject(new Error("Run this command in an interactive terminal."));
      return;
    }

    stdout.write(label);
    let value = "";

    function finish() {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
      stdout.write("\n");
      resolve(value);
    }

    function onData(input: Buffer) {
      for (const character of input.toString()) {
        if (character === "\u0003") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          stdout.write("\n");
          reject(new Error("Admin setup cancelled."));
          return;
        }

        if (character === "\r" || character === "\n") {
          finish();
          return;
        }

        if (character === "\u007f" || character === "\b") {
          value = value.slice(0, -1);
        } else {
          value += character;
        }
      }
    }

    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

async function main() {
  const prompt = createInterface({ input: stdin, output: stdout });
  const name = await new Promise<string>((resolve) => {
    prompt.question("Administrator name: ", resolve);
  }).then((answer) => answer.trim());
  const email = await new Promise<string>((resolve) => {
    prompt.question("Administrator email: ", resolve);
  }).then((answer) => answer.trim().toLowerCase());
  prompt.close();

  if (name.length < 2 || name.length > 120) {
    throw new Error("Name must be between 2 and 120 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new Error("Enter a valid email address.");
  }

  const password = await promptForHiddenValue("Password (12-128 characters): ");
  const confirmation = await promptForHiddenValue("Confirm password: ");

  if (password.length < 12 || password.length > 128) {
    throw new Error("Password must be between 12 and 128 characters.");
  }

  if (password !== confirmation) {
    throw new Error("Passwords do not match.");
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction(async (transaction) => {
    if (await transaction.adminUser.count() > 0) {
      throw new Error("An administrator already exists; first-admin setup is disabled.");
    }

    const role = await transaction.role.findUnique({ where: { code: RoleCode.SUPER_ADMIN } });
    if (!role) {
      throw new Error("SUPER_ADMIN role is missing. Run the database seed first.");
    }

    if (await transaction.user.findUnique({ where: { email } })) {
      throw new Error("A user with that email already exists.");
    }

    const user = await transaction.user.create({
      data: { name, email },
    });

    await transaction.account.create({
      data: {
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: passwordHash,
      },
    });

    await transaction.adminUser.create({
      data: {
        userId: user.id,
        roles: { create: { roleId: role.id } },
      },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

  console.info(`First administrator created for ${email}. Sign in at http://localhost:3000/admin/sign-in.`);
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "First administrator setup failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });