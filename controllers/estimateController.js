import Estimate from "../models/estimateModel.js";

export const createEstimate = async (req, res) => {
  try {
    const {
      userId,
      customerId,
      brandLogoUrl,
      estimateNumber,
      estimatedate,
      estimateDueDate,
      companyName,
      poNumber,
      gstNumber,
      companyFullAddress,
      city,
      state,
      country,
      pincode,
      billTo,
      shipTo,
      products,
      payment,
      paymentStatus,
      estimateNote,
      termsAndCondition
    } = req.body;

    const estimate = new Estimate({
      userId,
      customerId,
      brandLogoUrl,
      estimateNumber,
      estimatedate,
      estimateDueDate,
      companyName,
      poNumber,
      gstNumber,
      companyFullAddress,
      city,
      state,
      country,
      pincode,
      billTo,
      shipTo,
      products,
      payment,
      paymentStatus,
      estimateNote,
      termsAndCondition
    });

    await estimate.save();
    res.status(201).json({ success: true, message: "Estimate created successfully", data: estimate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getEstimates = async (req, res) => {
  try {
    const estimates = await Estimate.find().populate("userId customerId");
    res.json({ success: true, message: "Fetched all estimates successfully", data: estimates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEstimateById = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id).populate("userId customerId");
    if (!estimate) {
      return res.status(404).json({ success: false, message: "Estimate not found" });
    }
    res.json({ success: true, message: "Estimate fetched successfully", data: estimate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("userId customerId");
    if (!estimate) {
      return res.status(404).json({ success: false, message: "Estimate not found" });
    }
    res.json({ success: true, message: "Estimate updated successfully", data: estimate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findByIdAndDelete(req.params.id);
    if (!estimate) {
      return res.status(404).json({ success: false, message: "Estimate not found" });
    }
    res.json({ success: true, message: "Estimate deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
