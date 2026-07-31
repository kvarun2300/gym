import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from './Modal';
import adminService from '../../services/adminService';

const PlanFormModal = ({ open, onClose, onSaved, plan }) => {
  const isEdit = !!plan;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (open) {
      reset(
        isEdit
          ? {
              name: plan.name,
              description: plan.description || '',
              durationDays: plan.durationDays,
              price: plan.price,
              features: (plan.features || []).join(', '),
              isFeatured: plan.isFeatured,
              isActive: plan.isActive,
            }
          : { isActive: true }
      );
    }
  }, [open, isEdit, plan, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        durationDays: Number(values.durationDays),
        price: Number(values.price),
        features: values.features
          ? values.features.split(',').map((f) => f.trim()).filter(Boolean)
          : [],
        isFeatured: !!values.isFeatured,
        isActive: values.isActive !== false,
      };

      if (isEdit) {
        await adminService.updatePlan(plan.id, payload);
        toast.success('Plan updated');
      } else {
        await adminService.createPlan(payload);
        toast.success('Plan created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Plan' : 'Add New Plan'} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="label-field">Plan Name</label>
          <input className="input-field" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label-field">Description</label>
          <textarea rows={2} className="input-field resize-none" {...register('description')} />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="label-field">Duration (days)</label>
            <input
              type="number"
              className="input-field"
              {...register('durationDays', { required: 'Required', min: { value: 1, message: 'Must be at least 1 day' } })}
            />
            {errors.durationDays && <p className="mt-1.5 text-xs text-danger">{errors.durationDays.message}</p>}
          </div>
          <div>
            <label className="label-field">Price (₹)</label>
            <input
              type="number"
              className="input-field"
              {...register('price', { required: 'Required', min: { value: 0, message: 'Must be positive' } })}
            />
            {errors.price && <p className="mt-1.5 text-xs text-danger">{errors.price.message}</p>}
          </div>
        </div>
        <div>
          <label className="label-field">Features (comma-separated)</label>
          <input className="input-field" placeholder="Gym access, Locker room, PT sessions" {...register('features')} />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" className="h-4 w-4 rounded accent-crimson" {...register('isFeatured')} />
            Featured plan
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" className="h-4 w-4 rounded accent-crimson" defaultChecked {...register('isActive')} />
            Active
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 !py-2.5 text-xs">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-cta flex-1 !py-2.5 text-xs disabled:opacity-60">
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Plan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PlanFormModal;
