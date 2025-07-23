import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/axiosInterceptor'
import Loader from '../../components/loader'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [reEnterOtp, setReEnterOtp] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    if (!email) return alert('Please enter your email')

    try {
      setLoading(true)
      if (!emailSent) {
        await api.post('/users/forgot-password', { email })
        setEmailSent(true)
        alert('OTP sent to your email.')
      } else {
        const verified = await handleVerify()
        if (verified) {
          navigate('/reset-password', {
            state: { email, otp }
          })
        } else {
          setReEnterOtp(true)
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    try {
      await api.post(`/users/verify-otp`, { email, otp })
      return true
    } catch (err) {
      console.log( err?.respone?.message);
      return false
    }
  }

  //   if (loading) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
  //     </div>
  //   );
  // }
  //   else {
  return (

    <>
    {loading && <Loader/>}
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-100'>
      

      <div className='bg-white shadow-md rounded-lg p-8 flex flex-col md:flex-row w-full max-w-4xl'>
        <div className='w-full md:w-1/2 mb-6 md:mb-0'>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            Forgot Password
          </h2>
          <p className='text-gray-600 mb-6'>
            Enter your email address, and we'll send you a reset OTP.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type='email'
              required
              placeholder='Enter email address'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400'
            />

            {emailSent && (
              <input
                type='text'
                required
                placeholder='Enter the OTP'
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400'
              />
            )}

            {reEnterOtp && (
              <p className='text-red-500 text-sm mt-1'>
                Invalid OTP. Please try again.
              </p>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200'
            >
              {emailSent ? 'Verify OTP' : 'Send OTP'}
            </button>
          </form>

          <button
            onClick={() => navigate('/login')}
            className='mt-4 text-indigo-600 hover:underline text-sm'
          >
            Back to Login
          </button>
        </div>

        <div className='w-full md:w-1/2 flex flex-col items-center justify-center'>
          <div className='grid grid-cols-3 grid-rows-3 gap-4 text-4xl text-gray-500'>
            <div className='col-start-2 row-start-1'>?</div>
            <div className='col-start-2 row-start-2 text-indigo-600'>✉️</div>
            <div className='col-start-3 row-start-3'>📤</div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
  // }
}
export default ForgotPassword
