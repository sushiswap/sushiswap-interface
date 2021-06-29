import React from 'react'
import styled from 'styled-components'

const NotificationContainer = styled.div`
    position: absolute;
    display: none;
    @media screen and (min-width: 1200px) {
        display: block;
		left: 0;
		&_notification {
			padding-left: 54px;
			padding-right: 54px;
			&-bg {
				max-width: 360px;
				position: relative;
				z-index: 5;
				padding: 20px 30px;
				background: linear-gradient(90deg, #4c186d -1%, #170e45 79.31%);
				min-height: 220px;
			}
			&::before {
				content: '';
				display: block;
				clip-path: polygon(100% 0, 0 50%, 100% 100%);
				background: #4c186d;
				width: 54px;
				height: 54px;
				position: absolute;
				top: 86px;
				left: 0;
			}
		}
    }
`

const SidebarCardNotification = styled.div`
    @media screen and (min-width: 1200px) {
        padding-left: 54px;
        padding-right: 54px;
        &::before {
            content: '';
            display: block;
            clip-path: polygon(100% 0, 0 50%, 100% 100%);
            background: #4c186d;
            width: 54px;
            height: 54px;
            position: absolute;
            top: 86px;
            left: 0;
        }
    }
`

const SidebarNotificationBg = styled.div`
    @media screen and (min-width: 1200px) {
        max-width: 360px;
        position: relative;
        z-index: 5;
        padding: 20px 30px;
        background: linear-gradient(90deg, #4c186d -1%, #170e45 79.31%);
        min-height: 220px;

        border-radius: 12px;
    }
`

const SidebarNotificationTitle = styled.div`
	white-space: pre-line;
`

export interface SidebarNotificationProps {
    active?: boolean
    title?: string
    description?: string
    top?: number,
    className?: string
}

export default function SidebarNotification({
    active = false,
    title,
    description,
    top = 0,
    className
}: SidebarNotificationProps) {
    if (!description) {
        return null
    }
    return (
        <NotificationContainer style={{top: top + '%'}} className={className}>
            <SidebarCardNotification>
                <SidebarNotificationBg>
                    <SidebarNotificationTitle className="text-lg font-bold">
                        {title}
                    </SidebarNotificationTitle>
                    <SidebarNotificationTitle>
                        {description}
                    </SidebarNotificationTitle>
                </SidebarNotificationBg>
            </SidebarCardNotification>
        </NotificationContainer>
    )
}