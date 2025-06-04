import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED'
  }

const Agent = ({ userName, userId, type }: AgentProps) => {
  const isSpeaking = true;
  const callStatus = CallStatus.ACTIVE;
  const messages = [
    "What's your name?",
    "My name is John Doe, nce to meet you!"
  ];
  const lastMessage = messages[messages.length - 1]

  return (
    <>
      <div className="call-view">
        <div className='card-interviewer'>
          <div className='avatar'>
            <Image
              src="/ai-avatar.png"
              alt='vapi'
              width={65}
              height={54}
              className="object-cover"
            />

            {isSpeaking && <span className='animate-speak'></span>}
          </div>

          <h3>AI Interview</h3>
        </div>

        <div className='card-border'>
          <div className='card-content'>
            <Image src="/user-avatar.png" alt='user' width={540} height={540} className="object-cover rounded-full size-[120px]" />

            <h3>{userName}</h3>
          </div>
        </div>
      </div>
        {messages.length > 0 && (
          <div className='transcript-border'>
            <div className='transcript'>
              <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}></p>
            </div>
          </div>
        )}
      <div className='flex w-full justify-center'>
        {callStatus !== 'ACTIVE' ? (
          <button className='relative btn-call'>
            <span className={cn('absolute animate-pin rounded-full opacity-75', callStatus !== 'CONNECTION' && 'hidden')} />

            <span>
              {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '. . .' }
            </span>
          </button>
        ): (
          <button className='btn-disconnect'>
            End
          </button>
        )}
      </div>
    </>
  )
}

export default Agent
