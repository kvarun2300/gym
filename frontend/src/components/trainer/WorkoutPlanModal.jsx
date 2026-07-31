import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../admin/Modal';
import trainerService from '../../services/trainerService';

const emptyExercise = { day: 'Day 1', name: '', sets: '', reps: '', restSeconds: '' };

const WorkoutPlanModal = ({ open, onClose, onSaved, plan, members, presetMemberId }) => {
  const isEdit = !!plan;
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'exercises' });

  useEffect(() => {
    if (open) {
      reset(
        isEdit
          ? {
              memberId: plan.memberId,
              title: plan.title,
              goal: plan.goal || '',
              startDate: plan.startDate || '',
              endDate: plan.endDate || '',
              exercises: plan.exercises?.length ? plan.exercises : [emptyExercise],
            }
          : { memberId: presetMemberId || '', exercises: [emptyExercise] }
      );
    }
  }, [open, isEdit, plan, presetMemberId, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = { ...values, exercises: values.exercises.filter((e) => e.name?.trim()) };
      if (isEdit) {
        await trainerService.updateWorkoutPlan(plan.id, payload);
        toast.success('Workout plan updated');
      } else {
        await trainerService.createWorkoutPlan(payload);
        toast.success('Workout plan assigned');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Workout Plan' : 'Assign Workout Plan'} maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="label-field">Member</label>
            <select className="input-field" disabled={!!presetMemberId || isEdit} {...register('memberId', { required: 'Select a member' })}>
              <option value="">Select member</option>
              {members?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.user?.name}
                </option>
              ))}
            </select>
            {errors.memberId && <p className="mt-1.5 text-xs text-danger">{errors.memberId.message}</p>}
          </div>
          <div>
            <label className="label-field">Plan Title</label>
            <input className="input-field" placeholder="e.g. 4-Day Strength Split" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="mt-1.5 text-xs text-danger">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label-field">Goal</label>
            <input className="input-field" placeholder="e.g. Fat loss" {...register('goal')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Start Date</label>
              <input type="date" className="input-field" {...register('startDate')} />
            </div>
            <div>
              <label className="label-field">End Date</label>
              <input type="date" className="input-field" {...register('endDate')} />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="label-field !mb-0">Exercises</label>
            <button
              type="button"
              onClick={() => append(emptyExercise)}
              className="flex items-center gap-1.5 text-xs font-medium text-crimson-light hover:underline"
            >
              <Plus size={13} /> Add Exercise
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 rounded-xl border border-white/[0.06] p-3">
                <input
                  className="input-field !py-2 col-span-2 text-xs"
                  placeholder="Day"
                  {...register(`exercises.${index}.day`)}
                />
                <input
                  className="input-field !py-2 col-span-4 text-xs"
                  placeholder="Exercise name"
                  {...register(`exercises.${index}.name`)}
                />
                <input
                  className="input-field !py-2 col-span-2 text-xs"
                  placeholder="Sets"
                  {...register(`exercises.${index}.sets`)}
                />
                <input
                  className="input-field !py-2 col-span-2 text-xs"
                  placeholder="Reps"
                  {...register(`exercises.${index}.reps`)}
                />
                <input
                  className="input-field !py-2 col-span-1 text-xs"
                  placeholder="Rest(s)"
                  {...register(`exercises.${index}.restSeconds`)}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="col-span-1 flex items-center justify-center text-white/30 hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 !py-2.5 text-xs">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-cta flex-1 !py-2.5 text-xs disabled:opacity-60">
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Assign Plan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WorkoutPlanModal;
