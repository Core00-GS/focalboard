// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useState} from 'react'

import './workspaceSwitcher.scss'
import {useHistory} from 'react-router-dom'

import {IWorkspace} from '../../blocks/workspace'
import ChevronDown from '../../widgets/icons/chevronDown'
import AddIcon from '../../widgets/icons/add'
import {setCurrent as setCurrentBoard} from '../../store/boards'
import {setCurrent as setCurrentView} from '../../store/views'
import {useAppDispatch} from '../../store/hooks'

import {UserSettings} from '../../userSettings'

import WorkspaceOptions, {DashboardOption} from './workspaceOptions'

type Props = {
    activeWorkspace?: IWorkspace
}

const WorkspaceSwitcher = (props: Props): JSX.Element => {
    const history = useHistory()
    const {activeWorkspace} = props
    const dispatch = useAppDispatch()
    const [showMenu, setShowMenu] = useState<boolean>(false)

    // TODO un-hardcode this teamID
    const teamID = 'atjjg8ofqb8kjnwy15yhezdgoh'

    const goToEmptyCenterPanel = () => {
        UserSettings.setLastBoardID(teamID, '')

        // TODO see if this works or do we need a solutiion
        // UserSettings.lastViewId = null
        dispatch(setCurrentBoard(''))
        dispatch(setCurrentView(''))
        history.replace(`/workspace/${activeWorkspace?.id}`)
    }

    return (
        <div className={'WorkspaceSwitcherWrapper'}>
            <div
                className='WorkspaceSwitcher'
                onClick={() => {
                    if (!showMenu) {
                        setShowMenu(true)
                    }
                }}
            >
                <span>{activeWorkspace?.title || DashboardOption.label}</span>
                <ChevronDown/>
            </div>
            {
                showMenu &&
                <WorkspaceOptions
                    activeWorkspaceId={activeWorkspace?.id || DashboardOption.value}
                    onBlur={() => {
                        setShowMenu(false)
                    }}
                    onChange={(workspaceId: string) => {
                        setShowMenu(false)
                        let newPath: string

                        if (workspaceId === DashboardOption.value) {
                            newPath = '/dashboard'
                        } else {
                            newPath = `/workspace/${workspaceId}`
                            UserSettings.lastWorkspaceId = workspaceId
                        }
                        history.push(newPath)

                        // TODO remove this and set the correct team ID
                        if ((window as any).setTeam) {
                            (window as any).setTeam('6xrgynzkpbfs5r76jneppj5foa')
                        }
                    }}
                />
            }
            {activeWorkspace &&
                <span
                    className='add-workspace-icon'
                    onClick={goToEmptyCenterPanel}
                >
                    <AddIcon/>
                </span>
            }
        </div>
    )
}

export default WorkspaceSwitcher
