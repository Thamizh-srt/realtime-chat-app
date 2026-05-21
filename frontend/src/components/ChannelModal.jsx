import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {openModal,closeModal} from '../slices/modalSlice';
import { createChannel } from '../thunks/createChannelThunk';

export default function ChannelModal() {
  const [channelName, setChannelName] = useState('');

    const dispatch = useDispatch();
    const { isChannelModalOpen, channelToEdit, isOpen, mode, channel } = useSelector((state) => state.modal);
    const onClose = ()=>{
        dispatch({type:'modal/closeModal'});
    }

    const onSubmit = (name)=>{
        if(name.trim()){
            dispatch(createChannel(name.trim()));
        }   
    }

    //   useEffect(() => {
    //     setChannelName(channel?.name ?? '');
    //   }, [channel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="absolute inset-0" onClick={()=>dispatch(closeModal())} />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl shadow-black/20">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {mode === 'edit' ? 'Edit channel' : 'Add channel'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'edit'
                ? 'Update the channel name and save your changes.'
                : 'Create a new channel that everyone can join.'}
            </p>
          </div>
          <button
            onClick={()=>dispatch(closeModal())}
            className="rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="channel-name">
          Channel name
        </label>
        <input
          id="channel-name"
          type="text"
          value={channelName}
          onChange={(event) => setChannelName(event.target.value)}
          className="mb-4 w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="e.g. design-system"
          autoFocus
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSubmit(channelName);
            }
          }}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(channelName)}
            className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {mode === 'edit' ? 'Save changes' : 'Create channel'}
          </button>
        </div>
      </div>
    </div>
  );
}
