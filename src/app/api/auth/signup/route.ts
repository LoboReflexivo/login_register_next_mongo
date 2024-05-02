import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, fullname } = await request.json();

    console.log(fullname, email, password);

    if (!password || password.lenght < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        {
          status: 400,
        }
      );
    }
    await connectDB();
    const userFound = await User.findOne({ email });

    if (userFound) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      fullname,
    });

    const savedUser = await user.save();

    return NextResponse.json({ savedUser });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}
