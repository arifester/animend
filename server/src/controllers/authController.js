const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const register = async (req, res) => {
    // 1. Get data from client request body
    const { username, email, password } = req.body;

    // Validation: Ensure all fields are present
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // 2. Check if user already exists (by email)
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 3. Hash the password (Security step)
        // 10 is the salt rounds (complexity cost)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Save user to MongoDB using Prisma
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                // wishlist will be empty by default
            }
        });

        // 5. Send success response (Exclude password from response)
        res.status(201).json({
            message: "User registered successfully",
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { register };
