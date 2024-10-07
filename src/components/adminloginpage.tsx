"'use client'"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useLogin } from "../LoginContext"

export function AdminSignupPageComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isRetrying, setIsRetrying] = useState(false)
  const navigate = useNavigate()
  const { login } = useLogin()

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const retryFetch = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
    let error
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw new Error("Fetch failed")
        return response
      } catch (err) {
        error = err
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    throw error
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsRetrying(true)

    try {
      const response = await retryFetch(
        `${import.meta.env.VITE_API_BASE_URL}/signup`, // Ensure this matches your backend endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      )

      const result = await response.json()
      if (response.ok) {
        login(username)
        navigate("/dashboard")
      } else {
        setErrorMessage(`Error: ${result.error}`)
      }
    } catch (error) {
      setErrorMessage("Failed to sign up after multiple attempts. Please try again later.")
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mysofiaproject-66mlfVbhf8cbJn1tTDyuO3qS4nhh0Z.png"
              alt="mySOFIA Logo"
              className="w-48 h-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up for mySOFIA
          </CardTitle>
          <CardDescription className="text-center">
            Create your account to access the expert dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    type="text"
                    required
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                Sign Up
              </Button>
            </div>
          </form>
          {errorMessage && (
            <div className="mt-4 text-center text-red-500 text-sm">
              {errorMessage}
            </div>
          )}
          {isRetrying && (
            <div className="mt-4 text-center text-sm">
              Retrying...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}