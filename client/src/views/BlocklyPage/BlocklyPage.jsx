import { message } from "antd"
import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel/BlocklyCanvasPanel"
import NavBar from "../../components/NavBar/NavBar"
import {
  getAuthorizedWorkspaceToolbox,
  getActivityToolbox,
  getActivityToolboxAll,
} from "../../Utils/requests"
import { useGlobalState } from "../../Utils/userState"

export default function BlocklyPage({ isSandbox }) {
  const [value] = useGlobalState("currUser")
  const [activity, setActivity] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const setup = async () => {
      // if we are in sandbox mode show all toolbox
      const sandboxActivity = JSON.parse(localStorage.getItem("sandbox-activity"))
      if (isSandbox) {
        const AllToolboxRes = await getActivityToolboxAll()
        if (!sandboxActivity?.id || value.role === "Mentor") {
          if (AllToolboxRes.data) {
            let loadedActivity = {
              ...sandboxActivity,
              toolbox: AllToolboxRes.data.toolbox,
            }
            localStorage.setItem("sandbox-activity", JSON.stringify(loadedActivity))
            setActivity(loadedActivity)
          } else {
            message.error(AllToolboxRes.err)
          }
        } else if (value.role === "ContentCreator") {
          const res = await getAuthorizedWorkspaceToolbox(sandboxActivity.id)
          if (res.data) {
            let loadedActivity = { ...sandboxActivity, selectedToolbox: res.data.toolbox }
            loadedActivity = { ...loadedActivity, toolbox: AllToolboxRes.data.toolbox }

            localStorage.setItem("sandbox-activity", JSON.stringify(loadedActivity))
            setActivity(loadedActivity)
          } else {
            message.error(res.err)
          }
        }
      }
      // else show toolbox based on the activity we are viewing
      else {
        const localActivity = JSON.parse(localStorage.getItem("my-activity"))

        if (localActivity) {
          if (localActivity.toolbox) {
            setActivity(localActivity)
          } else {
            const res = await getActivityToolbox(localActivity.id)
            if (res.data) {
              let loadedActivity = { ...localActivity, toolbox: res.data.toolbox }

              localStorage.setItem("my-activity", JSON.stringify(loadedActivity))
              setActivity(loadedActivity)
            } else {
              message.error(res.err)
            }
          }
        } else {
          navigate(-1)
        }
      }
    }

    setup()
  }, [isSandbox, navigate, value.role])

  const lessonWindowRef = useRef(null)
  const handleHide = () => {
    if (lessonWindowRef.current && !lessonWindowRef.current.closed) {
      lessonWindowRef.current.close()
      lessonWindowRef.current = null
    } else {
      lessonWindowRef.current = window.open('', '_blank')
      lessonWindowRef.current.document.write('<html><head><title>Lesson</title></head><body style="background-color: white;">')
      lessonWindowRef.current.document.write('<h1>Lesson Open</h1>') // Add more HTML content as needed
      lessonWindowRef.current.document.write('</body></html>')
      lessonWindowRef.current.document.close()
    }
  }

  return (
    <div className="container nav-padding">
    <NavBar />
    <div className="blocklyTreeLabel">
    <button id="hideButton" className="Hide" onClick={handleHide}>Hide Lesson</button>

    
    
      <BlocklyCanvasPanel activity={activity} setActivity={setActivity} isSandbox={isSandbox} />
      
    </div>
  </div>
  )
}
