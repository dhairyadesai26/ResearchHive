import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext(null)

function Tabs({ defaultValue, value, onValueChange, children, className, ...props }) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue)

  React.useEffect(() => {
    if (value !== undefined) setActiveTab(value)
  }, [value])

  const handleChange = (val) => {
    setActiveTab(val)
    onValueChange?.(val)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ children, className, ...props }) {
  return (
    <div className={cn("tabs-list", className)} role="tablist" {...props}>
      {children}
    </div>
  )
}

function TabsTrigger({ value, children, className, ...props }) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn("tab-trigger", isActive && "tab-trigger-active", className)}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, children, className, ...props }) {
  const { activeTab } = React.useContext(TabsContext)

  if (activeTab !== value) return null

  return (
    <div role="tabpanel" className={cn("tab-content", className)} {...props}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
