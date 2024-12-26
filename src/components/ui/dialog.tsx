import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

interface DialogFixes {
    // There is an issue with input in dialog on add to playlist dialog where moving the pointer causes strange behaviour in input
    // The dialog is nested in a dropdown
    // Moving the pointer selects the text, as a result the user types over their input
    // Disabling event propagation on onPointerMove fixes the issue
    // This is needed in the DialogContent for, pointer movement in the content, and then it's needed in DialogOverlay for the same reason
    // Not perfect because moving outside the window still creates this issue
    dialogInputIssueFix?: boolean
    // Currently the add-to-playlist dialog in dropdown is not set up that well and to fix issues surrounding it this is used
    // The issue comes from the way it's all designed, clicking dropdown-menu-items in dropdown closes the dropdown
    // That means the dialog won't open properly so the default is prevented in onClick and onKeyDown, and the dialog is then controlled
    // The clicks in the dialog however then propagate down and fire onClick on dropdown-menu-item that toggles the dialog
    // This prop is needed because propagation also needs to be disabled on the overlay for the same reason
    controlledDialogInDropdownIssueFix?: boolean
}

interface DialogOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>, DialogFixes {}
const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, DialogOverlayProps>(
    ({ dialogInputIssueFix, controlledDialogInDropdownIssueFix, className, ...props }, ref) => (
        <DialogPrimitive.Overlay
            ref={ref}
            onPointerMove={dialogInputIssueFix === true ? (e) => e.stopPropagation() : undefined}
            onClick={controlledDialogInDropdownIssueFix === true ? (e) => e.stopPropagation() : undefined}
            className={cn(
                "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                className
            )}
            {...props}
        />
    )
)
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, DialogFixes {}
const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
    ({ dialogInputIssueFix, controlledDialogInDropdownIssueFix, className, children, ...props }, ref) => (
        <DialogPortal>
            <DialogOverlay
                dialogInputIssueFix={dialogInputIssueFix}
                controlledDialogInDropdownIssueFix={controlledDialogInDropdownIssueFix}
            />
            <DialogPrimitive.Content
                ref={ref}
                onClick={controlledDialogInDropdownIssueFix === true ? (e) => e.stopPropagation() : undefined}
                onPointerMove={dialogInputIssueFix === true ? (e) => e.stopPropagation() : undefined}
                className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <Cross2Icon className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPortal>
    )
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
