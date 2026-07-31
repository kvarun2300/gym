import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../admin/Modal';
import trainerService from '../../services/trainerService';

const emptyItem = { name: '', quantity: '', calories: '' };
const emptyMeal = { mealType: 'Breakfast', items: [emptyItem] };

const MealItemsField = ({ control, register, mealIndex }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `meals.${mealIndex}.items` });

  return (
    <div className="space-y-2">
      {fields.map((field, itemIndex) => (
        <div key={field.id} className="grid grid-cols-12 gap-2">
          <input
            className="input-field !py-2 col-span-6 text-xs"
            placeholder="Food item"
            {...register(`meals.${mealIndex}.items.${itemIndex}.name`)}
          />
          <input
            className="input-field !py-2 col-span-3 text-xs"
            placeholder="Quantity"
            {...register(`meals.${mealIndex}.items.${itemIndex}.quantity`)}
          />
          <input
            className="input-field !py-2 col-span-2 text-xs"
            placeholder="kcal"
            {...register(`meals.${mealIndex}.items.${itemIndex}.calories`)}
          />
          <button
            type="button"
            onClick={() => remove(itemIndex)}
            className="col-span-1 flex items-center justify-center text-white/30 hover:text-danger"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append(emptyItem)}
        className="flex items-center gap-1.5 text-xs font-medium text-crimson-light hover:underline"
      >
        <Plus size={12} /> Add Item
      </button>
    </div>
  );
};

const DietPlanModal = ({ open, onClose, onSaved, plan, members, presetMemberId }) => {
  const isEdit = !!plan;
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { fields: mealFields, append: appendMeal, remove: removeMeal } = useFieldArray({ control, name: 'meals' });

  useEffect(() => {
    if (open) {
      reset(
        isEdit
          ? {
              memberId: plan.memberId,
              title: plan.title,
              targetCalories: plan.targetCalories || '',
              notes: plan.notes || '',
              startDate: plan.startDate || '',
              endDate: plan.endDate || '',
              meals: plan.meals?.length ? plan.meals : [emptyMeal],
            }
          : { memberId: presetMemberId || '', meals: [emptyMeal] }
      );
    }
  }, [open, isEdit, plan, presetMemberId, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        meals: values.meals
          .map((m) => ({ ...m, items: (m.items || []).filter((i) => i.name?.trim()) }))
          .filter((m) => m.mealType?.trim()),
      };
      if (isEdit) {
        await trainerService.updateDietPlan(plan.id, payload);
        toast.success('Diet plan updated');
      } else {
        await trainerService.createDietPlan(payload);
        toast.success('Diet plan assigned');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Diet Plan' : 'Assign Diet Plan'} maxWidth="max-w-3xl">
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
            <input className="input-field" placeholder="e.g. Cutting Phase Plan" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="mt-1.5 text-xs text-danger">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label-field">Target Calories (kcal/day)</label>
            <input type="number" className="input-field" {...register('targetCalories')} />
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
          <div className="sm:col-span-2">
            <label className="label-field">Notes</label>
            <textarea rows={2} className="input-field resize-none" {...register('notes')} />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="label-field !mb-0">Meals</label>
            <button
              type="button"
              onClick={() => appendMeal(emptyMeal)}
              className="flex items-center gap-1.5 text-xs font-medium text-crimson-light hover:underline"
            >
              <Plus size={13} /> Add Meal
            </button>
          </div>
          <div className="space-y-4">
            {mealFields.map((meal, mealIndex) => (
              <div key={meal.id} className="rounded-xl border border-white/[0.06] p-4">
                <div className="mb-3 flex items-center gap-3">
                  <input
                    className="input-field !py-2 flex-1 text-xs"
                    placeholder="Meal type (e.g. Breakfast)"
                    {...register(`meals.${mealIndex}.mealType`)}
                  />
                  <button
                    type="button"
                    onClick={() => removeMeal(mealIndex)}
                    className="text-white/30 hover:text-danger"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <MealItemsField control={control} register={register} mealIndex={mealIndex} />
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

export default DietPlanModal;
