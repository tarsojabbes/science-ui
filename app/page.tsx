'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BookOpen, Users, FileText, Award, ArrowRight } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="w-full px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-gray-800 dark:text-gray-200" />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">ScienceUI</span>
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/login')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Login
            </Button>
            <Button 
              onClick={() => router.push('/sign-up')}
              className="bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-800"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Academic Publishing
            <span className="block text-gray-600 dark:text-gray-400">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline your research workflow with our comprehensive platform for managing papers, 
            journals, peer reviews, and academic publications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              onClick={() => router.push('/sign-up')}
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 text-lg dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-800"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/login')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Paper Management</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Submit, track, and manage your research papers with ease.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Journal Publishing</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage academic journals with organized issues.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Peer Review</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Streamlined peer review process with expert reviewers.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Quality Control</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Maintain high standards with comprehensive review workflows.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="bg-gray-800 dark:bg-gray-200 rounded-2xl p-12 text-white dark:text-gray-800">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of researchers and academics who trust ScienceUI for their publishing needs.
            </p>
            <Button 
              size="lg"
              onClick={() => router.push('/sign-up')}
              className="bg-white hover:bg-gray-100 text-gray-800 px-8 py-4 text-lg dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            >
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">ScienceUI</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2024 ScienceUI. Empowering academic research and publishing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
